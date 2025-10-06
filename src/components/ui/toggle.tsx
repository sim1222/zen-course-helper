export function Toggle({
	value,
	setValue,
	label,
}: {
	value: boolean;
	setValue: (e: boolean) => void;
	label?: string;
}) {
	return (
		<label className="inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				value=""
				className="sr-only peer"
				onChange={(e) => {
					setValue(e.target.checked);
				}}
				checked={value}
			/>
			<div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
			{label && (
				<span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
					{label}
				</span>
			)}
		</label>
	);
}
