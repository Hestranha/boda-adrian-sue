import { useState, useRef, useEffect } from "preact/hooks";
import type { JSX } from "preact";
import ButtonSecondary from "./ButtonSecondary";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import MusicResumeModal, { type MusicDataToSave } from "./MusicResumeModal";
import ConfirmationModal from "./ConfirmationModal";

import "../styles/modal.css";

interface MusicFormProps {
	googleFormsUrl: string;
	googleFormsAsistenteField: string;
	googleFormsMusicaField: string;
}

export default function MusicForm({ googleFormsUrl, googleFormsAsistenteField, googleFormsMusicaField }: MusicFormProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isConfirmModal, setIsConfirmModal] = useState(false);
	const [isViewResume, setIsViewResume] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const [nombre, setNombre] = useState("");
	const [cancion, setCancion] = useState("");

	const [isNombreValid, setIsNombreValid] = useState(true);
	const [isCancionValid, setIsCancionValid] = useState(true);

	const [resumen, setResumen] = useState<MusicDataToSave[] | null>(null);

	useEffect(() => {
		const guardado = localStorage.getItem("resumenMusica");
		if (guardado) {
			try {
				const data = JSON.parse(guardado);
				setResumen(Array.isArray(data) ? data : [data]);
			} catch (e) {
				console.error("Error reading resumenMusica:", e);
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

	const handleSubmit = async (e: JSX.TargetedEvent<HTMLFormElement>) => {
		e.preventDefault();

		const validNombre = !!nombre.trim();
		const validCancion = !!cancion.trim();

		setIsNombreValid(validNombre);
		setIsCancionValid(validCancion);

		if (!validNombre || !validCancion) return;

		setIsLoading(true);

		const formData = new FormData();
		formData.append(googleFormsAsistenteField, nombre);
		formData.append(googleFormsMusicaField, cancion);

		try {
			await fetch(googleFormsUrl, {
				method: "POST",
				mode: "no-cors",
				body: formData,
			});

			const newData: MusicDataToSave = { nombre, cancion };
			const updatedResumen = resumen ? [...resumen, newData] : [newData];

			setResumen(updatedResumen);
			localStorage.setItem("resumenMusica", JSON.stringify(updatedResumen));

			setIsOpen(false);
			setIsConfirmModal(true);
			setNombre("");
			setCancion("");
		} catch (error) {
			console.error("Error submitting form", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex gap-2 justify-center items-center'>
			<div className='flex flex-col gap-3 justify-center items-center'>
				<ButtonSecondary
					className='flex justify-center items-center w-fit gap-1 text-xs'
					onClick={() => setIsOpen(true)}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='w-5 h-5'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path
							stroke='none'
							d='M0 0h24v24H0z'
							fill='none'
						></path>
						<path d='M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0'></path>
						<path d='M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0'></path>
						<path d='M9 17v-13h10v13'></path>
						<path d='M9 8h10'></path>
					</svg>
					<span>Música</span>
				</ButtonSecondary>

				{resumen && (
					<button
						className='text-primary-neutral underline text-sm cursor-pointer hover:text-primary transition-colors font-semibold'
						onClick={() => setIsViewResume(true)}
						type='button'
					>
						Ver mis recomendaciones
					</button>
				)}
			</div>

			<MusicResumeModal
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
						<TextInput
							name='nombre'
							placeholder='Nombre del asistente:'
							value={nombre}
							onInput={(e) => {
								setNombre(e.currentTarget.value);
								setIsNombreValid(!!e.currentTarget.value.trim());
							}}
							isValid={isNombreValid}
						/>
						<TextArea
							name='mensaje'
							placeholder='Nombre de la canción:'
							value={cancion}
							onInput={(e) => {
								setCancion(e.currentTarget.value);
								setIsCancionValid(!!e.currentTarget.value.trim());
							}}
							isValid={isCancionValid}
						/>
						<ButtonSecondary
							type='submit'
							className='flex self-end items-center justify-center gap-1 w-auto px-6'
							disabled={isLoading}
						>
							<span>{isLoading ? "Enviando..." : "Enviar"}</span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-5 h-5'
								viewBox='0 0 24 24'
								fill='none'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path
									stroke='none'
									d='M0 0h24v24H0z'
									fill='none'
								></path>
								<path d='M10 14l11 -11'></path>
								<path d='M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5'></path>
							</svg>
						</ButtonSecondary>
					</form>
				</section>
			</dialog>
			<ConfirmationModal
				isOpen={isConfirmModal}
				onClose={() => setIsConfirmModal(false)}
				title='¡Gracias por recomendar tu música!'
			/>
		</div>
	);
}
