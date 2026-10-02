import { useEffect, useRef } from "preact/hooks";
import ButtonSecondary from "./ButtonSecondary";

import "../styles/modal.css";

export interface WishDataToSave {
	nombre: string;
	mensaje: string;
}

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
}

interface WishingWellResumeModalProps extends ModalProps {
	data: WishDataToSave[] | null;
}

const WishingWellResumeModal = ({ isOpen, onClose, data }: WishingWellResumeModalProps) => {
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

	if (!data || data.length === 0) return null;

	return (
		<dialog
			ref={dialogRef}
			className='modal-component fixed inset-0 w-full h-full max-w-none max-h-none m-0 p-0 bg-transparent justify-center items-center z-50 backdrop-blur-xs font-primary border-none open:flex'
		>
			<section className='flex relative justify-center flex-col items-center rounded-lg bg-white py-8 shadow-[0_0_8px_rgba(0,0,0,0.47)] w-10/12 lg:w-1/3 px-5'>
				<button
					className='absolute top-0 right-0 font-bold text-primary w-10 h-10 p-0 border-none bg-transparent cursor-pointer'
					onClick={onClose}
					type='button'
				>
					<span className='text-3xl'>×</span>
				</button>
				<h2 className='font-display text-lg lg:text-xl w-full text-center font-bold'>Tus deseos enviados</h2>
				<div className='w-full max-w-md py-4 max-h-[60vh] overflow-y-auto'>
					{data.map((item, index) => (
						<table
							key={index}
							className='w-full border-collapse text-sm text-left table-fixed text-primary-neutral border-b last:border-b-0 border-primary-neutral/20'
						>
							<tbody>
								<tr>
									<td className='py-1 px-2 font-semibold w-1/3 align-top'>Nombre</td>
									<td className='py-1 px-2 wrap-break-word w-2/3 align-top'>{item.nombre}</td>
								</tr>
								<tr>
									<td className='py-1 px-2 font-semibold w-1/3 align-top'>Mensaje</td>
									<td className='py-1 px-2 w-2/3 align-top'>
										<div className='overflow-auto wrap-break-word whitespace-pre-line'>{item.mensaje}</div>
									</td>
								</tr>
							</tbody>
						</table>
					))}
				</div>
				<ButtonSecondary
					onClick={onClose}
					className='w-full mt-4'
					text='Cerrar'
				/>
			</section>
		</dialog>
	);
};

export default WishingWellResumeModal;
