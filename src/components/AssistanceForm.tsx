import { useState, useEffect } from "preact/hooks";
import type { JSX } from "preact";
import ButtonSecondary from "./ButtonSecondary";
import ConfirmationModal from "./ConfirmationModal";
import SendIcon from "../core/icons/SendIcon";

import "../styles/modal.css";

// --- Interfaces ---

interface AsistenciaInfo {
	formUrl: string;
	field_nombre: string;
	field_celular: string;
	field_confirmacion: string;
	field_mensaje: string;
}

interface Props {
	asistencia: AsistenciaInfo;
	mensajeAsistencia?: string;
	pases: number;
}

export default function AssistanceForm({ asistencia, mensajeAsistencia, pases }: Props) {
	const [nombre, setNombre] = useState("");
	const [celular, setCelular] = useState("");
	const [confirmacion, setConfirmacion] = useState("");
	const [mensaje, setMensaje] = useState("");

	const [isNombreValid, setIsNombreValid] = useState(true);
	const [isConfirmacionValid, setIsConfirmacionValid] = useState(true);

	const [isLoading, setIsLoading] = useState(false);
	const [isConfirmationModal, setIsConfirmationModal] = useState(false);
	const [enviado, setEnviado] = useState(false);
	const [statusEnviado, setStatusEnviado] = useState("");

	const googleForms = asistencia.formUrl || "";
	const googleFormsNombre = asistencia.field_nombre || "";
	const googleFormsCelular = asistencia.field_celular || "";
	const googleFormsConfirmacion = asistencia.field_confirmacion || "";
	const googleFormsMensaje = asistencia.field_mensaje || "";

	useEffect(() => {
		const guardado = localStorage.getItem("asistenciaEnviada");
		const guardadoStatus = localStorage.getItem("asistenciaConfirmacion");
		if (guardado) {
			setEnviado(true);
			setStatusEnviado(guardadoStatus || "");
		}
	}, []);

	const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault();

		let valid = true;

		if (!nombre.trim() || /\d/.test(nombre)) {
			setIsNombreValid(false);
			valid = false;
		} else {
			setIsNombreValid(true);
		}

		if (!confirmacion.trim()) {
			setIsConfirmacionValid(false);
			valid = false;
		} else {
			setIsConfirmacionValid(true);
		}

		if (!valid) return;

		const formData = new FormData();
		formData.append(googleFormsNombre, nombre || "-");
		formData.append(googleFormsCelular, celular || "-");
		formData.append(googleFormsConfirmacion, confirmacion !== "0" ? `Sí, asistirán ${confirmacion} invitados` : "No asistirá");
		if (googleFormsMensaje && mensaje.trim()) {
			formData.append(googleFormsMensaje, mensaje);
		}

		setIsLoading(true);
		try {
			await fetch(googleForms, {
				method: "POST",
				mode: "no-cors",
				body: formData,
			});

			localStorage.setItem("asistenciaEnviada", "true");
			localStorage.setItem("asistenciaConfirmacion", confirmacion);
			setStatusEnviado(confirmacion);
			setEnviado(true);
			setIsConfirmationModal(true);
			setNombre("");
			setCelular("");
			setConfirmacion("");
			setMensaje("");
		} catch (error) {
			console.error("Error al enviar el formulario:", error);
			alert("Error al enviar. Intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section className='flex flex-col justify-center items-center w-full py-10 gap-6 px-4'>
			<ConfirmationModal
				isOpen={isConfirmationModal}
				onClose={() => setIsConfirmationModal(false)}
			/>

			{!enviado && (
				<div
					className='flex flex-col text-center items-center w-full gap-2'
					data-sal='fade-up'
					data-sal-duration='1200'
				>
					<h2 className='font-display text-2xl lg:text-4xl text-primary font-semibold tracking-wide '>Confirma tu Asistencia</h2>
					<p className='text-sm lg:text-base text-primary-neutral w-[85%] lg:w-[500px] leading-relaxed'>{mensajeAsistencia || "Nos encantaría que nos confirmes si podrás acompañarnos."}</p>
				</div>
			)}

			{enviado ? (
				<div className='flex flex-col items-center gap-3 text-center animate-fade-in'>
					<h2 className='font-display text-2xl lg:text-4xl text-primary font-semibold tracking-wide mt-2'>¡Gracias por confirmar!</h2>
					<img
						className='w-full h-20 lg:h-24'
						src='/icons/assistance/confirmation.svg'
						alt='Confirmado'
					/>
					<p className='text-sm lg:text-base text-primary-neutral w-[80%] lg:w-120'>
						{statusEnviado === "0"
							? "Sentimos mucho que no nos puedas acompañar, pero agradecemos tu respuesta."
							: "Gracias por confirmar tu asistencia. Nos vemos este 28 de Noviembre del 2026."}
					</p>
				</div>
			) : (
				<form
					className='flex flex-col gap-3 w-[90%] lg:w-[420px]'
					onSubmit={handleSubmit}
					data-sal='fade-up'
					data-sal-duration='1000'
				>
					{/* Confirmación */}
					<select
						id='confirmacion'
						name='confirmacion'
						value={confirmacion}
						onChange={(e) => {
							const val = (e.currentTarget as HTMLSelectElement).value;
							setConfirmacion(val);
							setIsConfirmacionValid(!!val.trim());
						}}
						className={`w-full cursor-pointer border py-2 px-3 text-sm rounded-md focus:outline-none transition-colors ${
							!isConfirmacionValid ? "bg-status-error-bg border-status-error" : "bg-input-bg border-transparent hover:border-input-border-focus focus:border-input-border-focus"
						}`}
					>
						<option
							value=''
							disabled
							hidden
						>
							Confirmación:
						</option>
						<option value='0'>Lo siento, no podremos asistir</option>
						{Array.from({ length: pases }, (_, i) => (
							<option
								key={i}
								value={i + 1}
							>
								{i === 0 ? "1 asistente" : `${i + 1} asistentes`}
							</option>
						))}
					</select>
					{!isConfirmacionValid && <span className='text-xs text-status-error -mt-2 px-1'>Selecciona una opción.</span>}
					{/* Nombre del asistente */}
					{parseInt(confirmacion) > 1 ? (
						<textarea
							id='nombre-asistente'
							name='nombre'
							placeholder='Nombre del asistente 1, Nombre del asistente 2...'
							value={nombre}
							onInput={(e) => {
								const val = (e.currentTarget as HTMLTextAreaElement).value;
								setNombre(val);
								setIsNombreValid(!!(val.trim() && !/\d/.test(val)));
							}}
							rows={parseInt(confirmacion) > 4 ? 4 : parseInt(confirmacion)}
							className={`w-full border py-2 px-3 text-sm rounded-md focus:outline-none placeholder-primary-neutral transition-colors resize-none ${
								!isNombreValid
									? "bg-status-error-bg border-status-error"
									: "bg-input-bg border-transparent hover:border-input-border-focus focus:border-input-border-focus focus:bg-input-bg"
							}`}
						/>
					) : (
						<input
							id='nombre-asistente'
							type='text'
							name='nombre'
							placeholder='Nombre del asistente:'
							value={nombre}
							onInput={(e) => {
								const val = (e.currentTarget as HTMLInputElement).value;
								setNombre(val);
								setIsNombreValid(!!(val.trim() && !/\d/.test(val)));
							}}
							className={`w-full border py-2 px-3 text-sm rounded-md focus:outline-none placeholder-primary-neutral transition-colors ${
								!isNombreValid
									? "bg-status-error-bg border-status-error"
									: "bg-input-bg border-transparent hover:border-input-border-focus focus:border-input-border-focus focus:bg-input-bg"
							}`}
						/>
					)}
					{!isNombreValid && <span className='text-xs text-status-error -mt-2 px-1'>Ingresa un nombre válido (sin números).</span>}

					{/* Celular */}
					<input
						id='celular-asistente'
						type='number'
						name='celular'
						placeholder='Celular:'
						value={celular}
						onInput={(e) => setCelular((e.currentTarget as HTMLInputElement).value)}
						className='w-full border py-2 px-3 text-sm rounded-md bg-input-bg border-transparent hover:border-input-border-focus focus:border-input-border-focus focus:bg-input-bg focus:outline-none placeholder-primary-neutral transition-colors'
					/>

					{/* Mensaje para los novios */}
					<textarea
						id='mensaje-novios'
						name='mensaje'
						placeholder='Mensaje para los novios:'
						value={mensaje}
						onInput={(e) => setMensaje((e.currentTarget as HTMLTextAreaElement).value)}
						rows={4}
						className='w-full border py-2 px-3 text-sm rounded-md bg-input-bg border-transparent hover:border-input-border-focus focus:border-input-border-focus focus:bg-input-bg focus:outline-none placeholder-primary-neutral transition-colors resize-none'
					/>

					{/* Botón Enviar */}
					<div className='flex justify-end'>
						<ButtonSecondary
							type='submit'
							className='flex justify-center gap-2 items-center'
							disabled={isLoading}
						>
							<span>{isLoading ? "Enviando..." : "Enviar"}</span>
							<SendIcon className='w-4 h-4' />
						</ButtonSecondary>
					</div>
				</form>
			)}
		</section>
	);
}
