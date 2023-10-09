import type * as CSS from 'csstype';

import type { Axis, Side, Align, Point, Size } from './types';

type GetPlacementDataOptions = {
	/** The rect of the trigger we are placing around */
	triggerRect?: DOMRect;
	/** The rect of the trigger we are placing around */
	triggerOffset?: Point;
	/** The size of the popper to place */
	popperSize?: Size;
	/** An optional arrow size */
	arrowSize?: Size;
	/** An optional arrow offset (along the side, default: 0) */
	arrowOffset?: number;
	/** The desired side */
	side: Side;
	/** An optional side offset (distance from the side, default: 0)  */
	sideOffset?: number;
	/** The desired alignment */
	align: Align;
	/** An optional alignment offset (distance along the side, default: 0) */
	alignOffset?: number;
	/** An option to turn on/off the collision handling (default: true) */
	shouldAvoidCollisions?: boolean;
	/** The rect which represents the boundaries for collision checks */
	collisionBoundariesRect?: DOMRect;
	/** The tolerance used for collisions, ie. if we want them to trigger a bit earlier (default: 0) */
	collisionTolerance?: number;
};

type PlacementData = {
	popperStyles: CSS.Properties;
	placedSide?: Side;
	placedAlign?: Align;
};

/**
 * Given all the information necessary to compute it,
 * this function calculates all the necessary placement data.
 *
 * It will return:
 *
 * - the styles to apply to the popper (including a custom property that is useful to set the transform origin in the right place)
 * - the styles to apply to the arrow
 * - the placed side (because it might have changed because of collisions)
 * - the placed align (because it might have changed because of collisions)
 */
function getPlacementData({
	triggerRect,
	triggerOffset = {
		x: window.scrollX,
		y: window.scrollY
	},
	popperSize,
	side,
	sideOffset = 0,
	align,
	alignOffset = 0,
	shouldAvoidCollisions = true,
	collisionBoundariesRect,
	collisionTolerance = 0
}: GetPlacementDataOptions): PlacementData {
	// if we're not ready to do all the measurements yet,
	// we return some good default styles
	if (!triggerRect || !popperSize || !collisionBoundariesRect) {
		return {
			popperStyles: UNMEASURED_POPPER_STYLES
		};
	}

	// pre-compute points for all potential placements
	const allPlacementPoints = getAllPlacementPoints(
		popperSize,
		triggerRect,
		sideOffset,
		alignOffset
	);

	// get point based on side / align
	const popperPoint = allPlacementPoints[side][align];

	// if we don't need to avoid collisions, we can stop here
	if (shouldAvoidCollisions === false) {
		const popperStyles = getPlacementStylesForPoint(
			popperPoint,
			triggerOffset
		);

		return {
			popperStyles,
			placedSide: side,
			placedAlign: align
		};
	}

	// create a new rect as if element had been moved to new placement
	const popperRect = DOMRect.fromRect({ ...popperSize, ...popperPoint });

	// create a new rect representing the collision boundaries but taking into account any added tolerance
	const collisionBoundariesRectWithTolerance = getContractedRect(
		collisionBoundariesRect,
		collisionTolerance
	);

	// check for any collisions in new placement
	const popperCollisions = getCollisions(
		popperRect,
		collisionBoundariesRectWithTolerance
	);

	// do all the same calculations for the opposite side
	// this is because we need to check for potential collisions if we were to swap side
	const oppositeSide = getOppositeSide(side);
	const oppositeSidePopperPoint = allPlacementPoints[oppositeSide][align];
	const updatedOppositeSidePopperPoint = DOMRect.fromRect({
		...popperSize,
		...oppositeSidePopperPoint
	});
	const oppositeSidePopperCollisions = getCollisions(
		updatedOppositeSidePopperPoint,
		collisionBoundariesRectWithTolerance
	);

	// adjust side accounting for collisions / opposite side collisions
	const placedSide = getSideAccountingForCollisions(
		side,
		popperCollisions,
		oppositeSidePopperCollisions
	);

	// adjust alignnment accounting for collisions
	const placedAlign = getAlignAccountingForCollisions(
		popperSize,
		triggerRect,
		side,
		align,
		popperCollisions
	);

	const placedPopperPoint = allPlacementPoints[placedSide][placedAlign];

	// compute adjusted popper / arrow styles
	const popperStyles = getPlacementStylesForPoint(
		placedPopperPoint,
		triggerOffset
	);

	return {
		popperStyles,
		placedSide,
		placedAlign
	};
}

type AllPlacementPoints = Record<Side, Record<Align, Point>>;

function getAllPlacementPoints(
	popperSize: Size,
	triggerRect: DOMRect,
	sideOffset = 0,
	alignOffset = 0
): AllPlacementPoints {
	const x = getPopperSlotsForAxis(triggerRect, popperSize, 'x');
	const y = getPopperSlotsForAxis(triggerRect, popperSize, 'y');

	const topY    = y.before - sideOffset; // prettier-ignore
	const bottomY = y.after  + sideOffset; // prettier-ignore
	const leftX   = x.before - sideOffset; // prettier-ignore
	const rightX  = x.after  + sideOffset; // prettier-ignore

	// prettier-ignore
	const map: AllPlacementPoints = {
    top: {
      start:  { x: x.start + alignOffset, y: topY },
      center: { x: x.center,              y: topY },
      end:    { x: x.end - alignOffset,   y: topY },
    },
    right: {
      start:  { x: rightX, y: y.start + alignOffset },
      center: { x: rightX, y: y.center },
      end:    { x: rightX, y: y.end - alignOffset },
    },
    bottom: {
      start:  { x: x.start + alignOffset, y: bottomY },
      center: { x: x.center,              y: bottomY },
      end:    { x: x.end - alignOffset,   y: bottomY },
    },
    left: {
      start:  { x: leftX, y: y.start + alignOffset },
      center: { x: leftX, y: y.center },
      end:    { x: leftX, y: y.end - alignOffset },
    },
  };

	return map;
}

function getPopperSlotsForAxis(
	triggerRect: DOMRect,
	popperSize: Size,
	axis: Axis
) {
	const startSide = axis === 'x' ? 'left' : 'top';
	const triggerStart = triggerRect[startSide];

	const dimension = axis === 'x' ? 'width' : 'height';
	const triggerDimension = triggerRect[dimension];
	const popperDimension = popperSize[dimension];

	// prettier-ignore
	return {
    before: triggerStart - popperDimension,
    start:  triggerStart,
    center: triggerStart + (triggerDimension - popperDimension) / 2,
    end:    triggerStart + triggerDimension - popperDimension,
    after:  triggerStart + triggerDimension,
  };
}

/**
 * Gets an adjusted side based on collision information
 */
function getSideAccountingForCollisions(
	/** The side we want to ideally position to */
	side: Side,
	/** The collisions for this given side */
	collisions: Collisions,
	/** The collisions for the opposite side (if we were to swap side) */
	oppositeSideCollisions: Collisions
): Side {
	const oppositeSide = getOppositeSide(side);
	// in order to prevent premature jumps
	// we only swap side if there's enough space to fit on the opposite side
	return collisions[side] && !oppositeSideCollisions[oppositeSide]
		? oppositeSide
		: side;
}

/**
 * Gets an adjusted alignment based on collision information
 */
function getAlignAccountingForCollisions(
	/** The size of the popper to place */
	popperSize: Size,
	/** The size of the trigger we are placing around */
	triggerSize: Size,
	/** The final side */
	side: Side,
	/** The desired align */
	align: Align,
	/** The collisions */
	collisions: Collisions
): Align {
	const isHorizontalSide = side === 'top' || side === 'bottom';
	const startBound = isHorizontalSide ? 'left' : 'top';
	const endBound = isHorizontalSide ? 'right' : 'bottom';
	const dimension = isHorizontalSide ? 'width' : 'height';
	const istriggerBigger = triggerSize[dimension] > popperSize[dimension];

	if (align === 'start' || align === 'center') {
		if (
			(collisions[startBound] && istriggerBigger) ||
			(collisions[endBound] && !istriggerBigger)
		) {
			return 'end';
		}
	}

	if (align === 'end' || align === 'center') {
		if (
			(collisions[endBound] && istriggerBigger) ||
			(collisions[startBound] && !istriggerBigger)
		) {
			return 'start';
		}
	}

	return align;
}

function getPlacementStylesForPoint(
	point: Point,
	offset: Point
): CSS.Properties {
	const x = Math.round(point.x + offset.x);
	const y = Math.round(point.y + offset.y);
	return {
		position: 'absolute',
		top: 0,
		left: 0,
		minWidth: 'max-content',
		willChange: 'transform',
		transform: `translate3d(${x}px, ${y}px, 0)`
	};
}

const UNMEASURED_POPPER_STYLES: CSS.Properties = {
	// position: 'absolute' here is important because it will take the popper
	// out of the flow so it does not disturb the position of the trigger
	position: 'absolute',
	top: 0,
	left: 0,
	opacity: 0,
	transform: 'translate3d(0, -200%, 0)',
	alignItems: 'center'
};

/**
 * Gets the opposite side of a given side (ie. top => bottom, left => right, …)
 */
function getOppositeSide(side: Side): Side {
	const oppositeSides: Record<Side, Side> = {
		top: 'bottom',
		right: 'left',
		bottom: 'top',
		left: 'right'
	};
	return oppositeSides[side];
}

/**
 * Creates a new rect (`ClientRect`) based on a given one but contracted by
 * a given amout on each side.
 */
function getContractedRect(rect: DOMRect, amount: number) {
	return DOMRect.fromRect({
		width: rect.width - amount * 2,
		height: rect.height - amount * 2,
		x: rect.left + amount,
		y: rect.top + amount
	});
}

/**
 * Gets collisions for each side of a rect (top, right, bottom, left)
 */
function getCollisions(
	/** The rect to test collisions against */
	rect: DOMRect,
	/** The rect which represents the boundaries for collision checks */
	collisionBoundariesRect: DOMRect
) {
	return {
		top: rect.top < collisionBoundariesRect.top,
		right: rect.right > collisionBoundariesRect.right,
		bottom: rect.bottom > collisionBoundariesRect.bottom,
		left: rect.left < collisionBoundariesRect.left
	};
}

type Collisions = ReturnType<typeof getCollisions>;

export { getPlacementData };
export type { Side, Align };
