export const requestDeviceOrientationPermission = async () => {
	if (typeof DeviceMotionEvent.requestPermission === 'function') {
		const response = await DeviceMotionEvent.requestPermission();
		if (response == 'granted') {
			return true;
		}
		return false;
	}
	return true;
};
