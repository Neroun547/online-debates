export function getErrorMessage(
	error:
		| { message: string }
		| { message: Array<string> }
		| string
		| Array<string>
		| undefined
): string | undefined {
	if (!error) {
		return undefined;
	}
	if (Array.isArray(error)) {
		return error[0];
	}
	if (typeof error === "string") {
		return error;
	}
	if (error.message && typeof error.message === "string") {
		return error.message;
	}
	if (error.message && Array.isArray(error.message)) {
		return error.message[0];
	}
	return undefined;
}
