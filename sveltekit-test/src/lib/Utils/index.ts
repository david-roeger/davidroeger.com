/**
 * check if element is descendant of another element with given type
 * @param element this
 * @param type HTML Element tag name
 * @returns
 */
export const hasParentOfType = (element: HTMLElement, type: string): boolean => {
	type = type.toUpperCase();
	let parent = element.parentElement;
	while (parent) {
		if (parent.tagName === type) {
			return true;
		}
		parent = parent.parentElement;
	}
	return false;
};
