export default function LinkToExternal(props: {
	href: string;
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<a
			href={props.href}
			className={`text-blue-500 hover:underline ${props.className}`}
			target="_blank"
			rel="noopener noreferrer"
		>
			{props.children}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="currentColor"
				className="bi bi-box-arrow-up-right inline-block ml-0.5 w-3 h-3"
			>
				<title>box-arrow-up-right</title>
				<path
					fill-rule="evenodd"
					d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5"
				/>
				<path
					fill-rule="evenodd"
					d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z"
				/>
			</svg>
		</a>
	);
}
