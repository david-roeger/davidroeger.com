export const requestDeviceOrientationPermission = async () => {
	console.log('requestDeviceOrientationPermission');
	console.log(
		'typeof DeviceOrientationEvent PermissionState',
		typeof DeviceOrientationEvent.requestPermission
	);
	console.log('DeviceOrientationEvent', DeviceOrientationEvent);
	console.log(
		'DeviceOrientationEvent.requestPermission',
		DeviceOrientationEvent.requestPermission
	);
	if (typeof DeviceMotionEvent.requestPermission === 'function') {
		const response = await DeviceMotionEvent.requestPermission();
		if (response == 'granted') {
			return true;
		}
		return false;
	}
	return true;
};
