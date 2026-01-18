import type { FIELD } from "./numberingParser";

export const FieldColors: Record<keyof typeof FIELD, string> = {
	INT: "bg-amber-100 text-amber-800",
	BSC: "bg-indigo-100 text-indigo-800",
	INF: "bg-indigo-100 text-indigo-800",
	MTH: "bg-indigo-100 text-indigo-800",
	LAN: "bg-pink-100 text-pink-800",
	HUM: "bg-cyan-100 text-cyan-800",
	SOC: "bg-cyan-100 text-cyan-800",
	ECON: "bg-cyan-100 text-cyan-800",
	DIGI: "bg-cyan-100 text-cyan-800",
	CAR: "bg-stone-100 text-stone-800",
	OPT: "bg-purple-100 text-purple-800",
	PRJ: "bg-amber-100 text-amber-800",
};