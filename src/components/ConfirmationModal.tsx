import { useEffect, useRef } from "preact/hooks";
import ButtonSecondary from "./ButtonSecondary";
import SendIcon from "../core/icons/SendIcon";

import "../styles/modal.css";
import SuccessCheck from "../core/icons/SuccessCheck";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
}

const ConfirmationModal = ({ isOpen, onClose, title = "¡Gracias por confirmar tu asistencia!" }: ModalProps) => {
	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 w-full h-full m-0 p-0 bg-black/40 flex justify-center items-center z-[100] backdrop-blur-sm font-primary'>
			<section className='flex relative justify-center flex-col items-center rounded-lg bg-white py-8 shadow-[0_0_15px_rgba(0,0,0,0.5)] w-10/12 lg:w-1/3 px-5'>
				<button
					className='absolute top-0 right-0 font-bold text-primary w-10 h-10 p-0 border-none bg-transparent cursor-pointer'
					onClick={onClose}
					type='button'
				>
					<span className='text-3xl'>×</span>
				</button>
				<h2 className='font-display text-xl lg:text-2xl w-full text-center font-bold text-primary'>{title}</h2>

				<SuccessCheck
					id='success-animation'
					className='my-8'
				/>

				<ButtonSecondary
					onClick={onClose}
					className='w-full'
				>
					<span>Cerrar</span>
				</ButtonSecondary>
			</section>
		</div>
	);
};

export default ConfirmationModal;
