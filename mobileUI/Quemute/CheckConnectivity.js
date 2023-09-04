'use strict';

import {useNetInfo} from '@react-native-community/netinfo';

const checkConnectivity = () => {
	var connectionInfo = useNetInfo();

	return connectionInfo;
}

export default checkConnectivity