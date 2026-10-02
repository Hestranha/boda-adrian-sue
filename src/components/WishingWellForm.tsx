import { useState, useRef, useEffect } from "preact/hooks";
import type { JSX } from "preact";
import ButtonSecondary from "./ButtonSecondary";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import SendIcon from "../core/icons/SendIcon";
import ConfirmationModal from "./ConfirmationModal";
import WishingWellResumeModal, { type WishDataToSave } from "./WishingWellResumeModal";

import "../styles/modal.css";
import SendIcon2 from '../core/icons/SendIcon2';

interface WishingWellProps {
	formUrl: string;
	field_nombre: string;
	field_mensaje: string;
}

export default function WishingWellForm({ formUrl, field_nombre, field_mensaje }: WishingWellProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmModal, setIsConfirmModal] = useState(false);
	const [isViewResume, setIsViewResume] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [nombre, setNombre] = useState("");
	const [mensaje, setMensaje] = useState("");

	const [isNombreValid, setIsNombreValid] = useState(true);
	const [isMensajeValid, setIsMensajeValid] = useState(true);

	const [resumen, setResumen] = useState<WishDataToSave[] | null>(null);

	useEffect(() => {
		const guardado = localStorage.getItem("resumenDeseos");
		if (guardado) {
			try {
				const data = JSON.parse(guardado);
				setResumen(Array.isArray(data) ? data : [data]);
			} catch (e) {
				console.error("Error reading resumenDeseos:", e);
			}
		}
	}, []);

	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog) {
			if (isOpen) dialog.showModal();
			else dialog.close();
		}
	}, [isOpen]);

	const handleChange = (e: JSX.TargetedEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.currentTarget;

		if (name === "nombre") {
			setNombre(value);
			setIsNombreValid(!!(value.trim() && !/\d/.test(value)));
		} else if (name === "mensaje") {
			setMensaje(value);
			setIsMensajeValid(!!value.trim());
		}
	};

	const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault();

		let valid = true;

		if (!nombre.trim() || /\d/.test(nombre)) {
			setIsNombreValid(false);
			valid = false;
		}

		if (!mensaje.trim()) {
			setIsMensajeValid(false);
			valid = false;
		}

		if (!valid) return;

		const formData = new FormData();
		formData.append(field_nombre, nombre);
		formData.append(field_mensaje, mensaje);

		setIsLoading(true);
		try {
			await fetch(formUrl, {
				method: "POST",
				mode: "no-cors",
				body: formData,
			});

			const newData: WishDataToSave = { nombre, mensaje };
			const updatedResumen = resumen ? [...resumen, newData] : [newData];

			setResumen(updatedResumen);
			localStorage.setItem("resumenDeseos", JSON.stringify(updatedResumen));

			setIsOpen(false);
			setIsConfirmModal(true);
			setNombre("");
			setMensaje("");
		} catch (error) {
			console.error("Error al enviar el mensaje:", error);
			alert("Error al enviar. Intenta de nuevo.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex gap-2 justify-center items-center w-full'>
			<div className='flex flex-col gap-3 justify-center items-center w-full'>
				<ButtonSecondary
					className='flex justify-center items-center w-fit gap-2'
					onClick={() => setIsOpen(true)}
				>
					<SendIcon2 className='w-4 h-4'/>
					<span>Dejar un mensaje</span>
				</ButtonSecondary>

				{resumen && (
					<button
						className='text-primary-neutral underline text-sm cursor-pointer hover:text-primary transition-colors font-semibold'
						onClick={() => setIsViewResume(true)}
						type='button'
					>
						Ver mis deseos enviados
					</button>
				)}
			</div>

			<WishingWellResumeModal
				isOpen={isViewResume}
				onClose={() => setIsViewResume(false)}
				data={resumen}
			/>

			{/* Main Form Modal */}
			<dialog
				ref={dialogRef}
				className='modal-component fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-transparent justify-center items-center z-50 backdrop-blur-xs font-primary border-none open:flex'
			>
				<section className='flex relative justify-center flex-col items-center rounded-lg bg-white py-8 shadow-[0_0_8px_rgba(0,0,0,0.47)] w-10/12 lg:w-1/3 px-5 gap-3'>
					<button
						type='button'
						className='absolute top-0 right-0 font-bold text-primary w-10 h-10 p-0 border-none cursor-pointer bg-transparent'
						onClick={() => setIsOpen(false)}
					>
						<span className='text-3xl'>×</span>
					</button>
					<h2 className='text-xl lg:text-2xl w-full text-center font-bold'>Ingresa la información</h2>
					
					<form
						className='flex flex-col gap-2 w-full lg:w-11/12 text-primary'
						onSubmit={handleSubmit}
					>
						<div className='w-full text-left'>
							<TextInput
								id='nombre-wishing'
								name='nombre'
								placeholder='Tu nombre:'
								value={nombre}
								onInput={handleChange}
								isValid={isNombreValid}
							/>
							{!isNombreValid && <span className='text-xs text-status-error mt-1 px-1'>Ingresa un nombre válido (sin números).</span>}
						</div>

						<TextArea
							name='mensaje'
							placeholder='Mensaje para los novios:'
							value={mensaje}
							onInput={(e) => {
								setMensaje(e.currentTarget.value);
								setIsMensajeValid(!!e.currentTarget.value.trim());
							}}
							isValid={isMensajeValid}
						/>
						{!isMensajeValid && <span className='text-xs text-status-error px-1 text-left'>Escribe un mensaje.</span>}

						<ButtonSecondary
							type='submit'
							className='flex self-end items-center justify-center gap-1 w-auto px-6 mt-2'
							disabled={isLoading}
						>
							<span>{isLoading ? "Enviando..." : "Enviar deseos"}</span>
							<SendIcon className='w-4 h-4' />
						</ButtonSecondary>
					</form>
				</section>
			</dialog>
			<ConfirmationModal
				isOpen={isConfirmModal}
				onClose={() => setIsConfirmModal(false)}
				title='¡Gracias por tus hermosos deseos!'
			/>
		</div>
	);
}
