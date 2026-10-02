import { useEffect, useRef } from "preact/hooks";
import ButtonSecondary from "./ButtonSecondary";

import "../styles/modal.css";

export interface DataToSave {
	nombres: string[];
	numAsistentes: number;
	telefono: string;
	confirmacion: string;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface ResumeModalProps extends ModalProps {
	data: DataToSave | null;
}

const ResumeModal = ({ isOpen, onClose, data }: ResumeModalProps) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	}, [isOpen]);

	if (!data) return null;

	return (
		<dialog
			ref={dialogRef}
			className='modal-component fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-transparent justify-center items-center z-50 backdrop-blur-xs font-primary border-none open:flex'
		>
			<section className='flex relative justify-center flex-col items-center rounded-lg gap-4 bg-white py-8 shadow-[0_0_8px_rgba(0,0,0,0.47)] w-10/12 lg:w-1/3 px-5'>
				<button
					className='absolute top-0 right-0 font-bold text-primary w-10 h-10 p-0 border-none bg-transparent cursor-pointer'
					onClick={onClose}
					type='button'
				>
					<span className='text-3xl'>×</span>
				</button>
				<h2 className='font-display text-lg lg:text-xl w-full text-center font-bold'>Resumen de confirmación</h2>
				<div className='w-full max-w-md'>
					<table className='w-full border-collapse text-sm text-left table-fixed text-primary-neutral'>
						<tbody>
							{data.nombres.map((n, i) => (
								<tr
									key={i}
									className='border-b last:border-b-0'
								>
									<td className='py-1 px-2 font-semibold w-1/3 align-top'>Asistente {i + 1}</td>
									<td className='py-1 px-2 wrap-break-word w-2/3 align-top'>{n}</td>
								</tr>
							))}
							<tr className='border-b'>
								<td className='py-1 px-2 font-semibold w-1/3 align-top'>Teléfono</td>
								<td className='py-1 px-2 wrap-break-word w-2/3 align-top'>{data.telefono || "No especificado"}</td>
							</tr>
						</tbody>
					</table>
				</div>
				<ButtonSecondary
					onClick={onClose}
					className='w-full'
					text='Cerrar'
				/>
			</section>
		</dialog>
	);
};

export default ResumeModal;
