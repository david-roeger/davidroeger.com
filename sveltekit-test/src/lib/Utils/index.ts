/**
 * check if element is descendant of another element with given type
 * @param element this
 * @param type HTML Element tag name
 * @returns
 */
export const hasParentOfType = (element: HTMLElement, type: string): boolean => {
	type = type.toUpperCase();
	const parent = element.parentElement;
	console.log(typeof element.tagName, element.tagName);
	if (parent) {
		if (parent.tagName === type) {
			return true;
		}
		hasParentOfType(parent, type);
	}
	return false;
};
