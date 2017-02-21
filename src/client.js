import reduce from 'lodash/reduce';
import map from 'lodash/map';
import join from 'lodash/join';

export default http => ({
	getTranslations: locale =>
		http.getUnauthenticated(`/translations/${locale}`),

	destroySession: () =>
		http.del('/authorization/token'),

	getAddresses: () =>
		http.get('/addresses'),

	getFaxlines: userId =>
		http.get(`/${userId}/faxlines`),

	getFaxlineNumbers: (userId, faxlineId) =>
		http.get(`/${userId}/faxlines/${faxlineId}/numbers`),

	setFaxlineAlias: (userId, faxlineId, alias) =>
		http.put(`/${userId}/faxlines/${faxlineId}`, { alias }),

	setFaxlineTagline: (userId, faxlineId, tagline) =>
		http.put(`/${userId}/faxlines/${faxlineId}/tagline`, { value: tagline }),

	createFaxline: userId =>
		http.post(`/${userId}/faxlines`),

	getFaxlineCallerId: (userId, faxlineId) =>
		http.get(`/${userId}/faxlines/${faxlineId}/callerid`),

	setFaxlineCallerId: (userId, faxlineId, callerId) =>
		http.put(`/${userId}/faxlines/${faxlineId}/callerid`, { value: callerId }),

	getPhonelines: userId =>
		http.get(`/${userId}/phonelines`),

	createPhoneline: userId =>
		http.post(`/${userId}/phonelines`),

	setPhonelineAlias: (userId, phonelineId, alias) =>
		http.put(`/${userId}/phonelines/${phonelineId}`, { alias }),

	createPhonelineDevice: (userId, phonelineId, deviceId) =>
		http.post(`/${userId}/phonelines/${phonelineId}/devices`, { deviceId }),

	deletePhonelineDevice: (userId, phonelineId, deviceId) =>
		http.del(`/${userId}/phonelines/${phonelineId}/devices/${deviceId}`),

	getPhonelineDevices: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/devices`),

	getPhonelineForwardings: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/forwardings`),

	getPhonelineNumbers: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/numbers`),

	getPhonelineParallelforwardings: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/parallelforwardings`),

	createPhonelineParallelforwarding: (userId, phonelineId, alias, destination) =>
		http.post(`/${userId}/phonelines/${phonelineId}/parallelforwardings`, { alias, destination, active: true }),

	setPhonelineParallelforwarding: (userId, phonelineId, parallelforwardingId, parallelforwarding) =>
		http.put(`/${userId}/phonelines/${phonelineId}/parallelforwardings/${parallelforwardingId}`, parallelforwarding),

	getPhonelineVoicemails: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/voicemails`),

	getPhonelineVoicemailGreetings: (userId, phonelineId, voicemailId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`),

	setVoicemail: (userId, phonelineId, voicemailId, active, timeout, transcription) =>
		http.put(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}`,
			{ timeout, active, transcription },
		),

	getUser: userId =>
		http.get(`/users/${userId}`),

	getUsers: () =>
		http.get('/users/'),

	activateGreeting: (userId, phonelineId, voicemailId, greetingId) =>
		http.put(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`,
			{ active: true },
		),

	createGreeting: (userId, phonelineId, voicemailId, filename, base64Content) =>
		http.post(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`,
			{ filename, base64Content },
		),

	deleteGreeting: (userId, phonelineId, voicemailId, greetingId) =>
		http.del(`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`),

	changeForwarding: (userId, phonelineId, forwardings) =>
		http.put(
			`/${userId}/phonelines/${phonelineId}/forwardings`,
			{ forwardings },
		),

	setDeviceSettings: (deviceId, dnd, emergencyAddressId) =>
		http.put(`/devices/${deviceId}`, { dnd, emergencyAddressId }),

	setDeviceAlias: (deviceId, alias) =>
		http.put(`/devices/${deviceId}/alias`, { value: alias }),

	resetDevicePassword: deviceId =>
		http.post(`/devices/${deviceId}/credentials/password`),

	getDevices: userId =>
		http.get(`/${userId}/devices`),

	createDevice: (userId, type) =>
		http.post(`/${userId}/devices`, { type: type }),

	getTacs: () =>
		http.get('/app/tacs'),

	acceptTacs: () =>
		http.put('/app/tacs', { accepted: true }),

	fetchLinks: () =>
		http.get('/app/links'),

	getHistory: (userId, phonelineId, types, directions, limit) => {
		let url = `/${userId}/history?phonelineId=${phonelineId}&limit=${limit}`;
		url += reduce(types, (joined, type) => `${joined}&types=${type}`, '');
		url += reduce(directions, (joined, direction) => `${joined}&directions=${direction}`, '');

		return http.get(url);
	},

	deleteHistoryEntry: (userId, id) =>
		http.del(`/${userId}/history/${id}`),

	getEvents: () =>
		http.get('/app/events'),

	deleteEvent: id =>
		http.del(`/app/events/${id}`),

	getCallerId: deviceId =>
		http.get(`/devices/${deviceId}/callerid`),

	setCallerId: (deviceId, callerId) =>
		http.put(`/devices/${deviceId}/callerid`, { value: callerId }),

	getTariffAnnouncement: deviceId =>
		http.get(`/devices/${deviceId}/tariffannouncement`),

	setTariffAnnouncement: (deviceId, enabled) =>
		http.put(`/devices/${deviceId}/tariffannouncement`, { enabled }),

	getNumbers: userId =>
		http.get(`/${userId}/numbers`),

	setNumberRouting: (numberId, endpointId) =>
		http.put(`/numbers/${numberId}`, { endpointId }),

	setNumberSettings: (numberId, endpointId, releaseForMnp) =>
		http.put(`/numbers/${numberId}`, { endpointId, releaseForMnp }),

	getPortings: () =>
		http.get('/portings'),

	revokePorting: portingId =>
		http.del(`/portings/${portingId}`),

	getWelcome: () =>
		http.get('/app/welcome'),

	setWelcome: enabled =>
		http.put('/app/welcome', { enabled }),

	initiateClickToDial: (phonelineId, caller, callee) =>
		http.post('/sessions/calls', { phonelineId, caller, callee }),

	getPhonelineBlockAnonymous: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/blockanonymous`),

	setPhonelineBlockAnonymous: (userId, phonelineId, enabled, target) =>
		http.put(`/${userId}/phonelines/${phonelineId}/blockanonymous`, { enabled, target }),

	getPhonelineBusyOnBusy: (userId, phonelineId) =>
		(http.get(`/${userId}/phonelines/${phonelineId}/busyonbusy`)),

	setPhonelineBusyOnBusy: (userId, phonelineId, enabled) =>
		(http.put(`/${userId}/phonelines/${phonelineId}/busyonbusy`, { enabled })),

	getContacts: () =>
		http.get('/contacts'),

	getInternalContacts: () =>
		http.get('/contacts/internal'),

	deleteContact: contactId =>
		http.del(`/contacts/${contactId}`),

	deleteAllContacts: () =>
		http.del('/contacts'),

	importContactsFromCSV: base64Content =>
		http.post('/contacts/import/csv', { base64Content }),

	importContactsFromGoogle: token =>
		http.post('/contacts/import/google', { token }),

	fetchSms: userId =>
		http.get(`/${userId}/sms`),

	setSmsAlias: (userId, smsId, alias) =>
		http.put(`/${userId}/sms/${smsId}`, { alias }),

	fetchSmsCallerIds: (userId, smsId) =>
		http.get(`/${userId}/sms/${smsId}/callerids`),

	createSmsCallerId: (userId, smsId, phonenumber) =>
		http.post(`/${userId}/sms/${smsId}/callerids`, { phonenumber }),

	verifySmsCallerId: (userId, smsId, callerId, verificationCode) =>
		http.post(`/${userId}/sms/${smsId}/callerids/${callerId}/verification`, { verificationCode }),

	setActiveSmsCallerId: (userId, smsId, callerId, defaultNumber) =>
		http.put(`/${userId}/sms/${smsId}/callerids/${callerId}`, { defaultNumber }),

	sendFax: (faxlineId, recipient, filename, base64Content) =>
		http.post('/sessions/fax', { faxlineId, recipient, filename, base64Content }),

	resendFax: (faxlineId, faxId) =>
		http.post('/sessions/fax/resend', { faxlineId, faxId }),

	sendSms: (smsId, recipient, message) =>
		http.post('/sessions/sms', { smsId, recipient, message }),

	getAccount: () =>
		http.get('/account'),

	getBalance: () =>
		http.get('/balance'),

	getNotifications: userId =>
		http.get(`/${userId}/notifications`),

	deleteNotification: (userId, notificationId) =>
		http.del(`/${userId}/notifications/${notificationId}`),

	createVoicemailEmailNotification: (userId, voicemailId, email) =>
		http.post(`/${userId}/notifications/voicemail/email`, { voicemailId, email }),

	createVoicemailSmsNotification: (userId, voicemailId, number) =>
		http.post(`/${userId}/notifications/voicemail/sms`, { voicemailId, number }),

	createFaxEmailNotification: (userId, faxlineId, email, direction) =>
		http.post(`/${userId}/notifications/fax/email`, { faxlineId, email, direction }),

	createFaxSmsNotification: (userId, faxlineId, number, direction) =>
		http.post(`/${userId}/notifications/fax/sms`, { faxlineId, number, direction }),

	createCallEmailNotification: (userId, endpointId, email, direction, cause) =>
		http.post(`/${userId}/notifications/call/email`, { endpointId, email, direction, cause }),

	createCallSmsNotification: (userId, endpointId, number, direction, cause) =>
		http.post(`/${userId}/notifications/call/sms`, { endpointId, number, direction, cause }),

	createFaxReportNotification: (userId, faxlineId, email) =>
		http.post(`/${userId}/notifications/fax/report`, { faxlineId, email }),

	createSmsEmailNotification: (userId, endpointId, email) =>
		http.post(`/${userId}/notifications/sms/email`, { endpointId, email }),

	fetchRestrictions: (userId, restrictions) => {
		let url = '/restrictions';
		if (typeof userId === 'string') {
			url += `/?userId=${userId}`;
			if (typeof restrictions === 'string' ) {
				url += `&${restrictions}`;
			} else if (Array.isArray(restrictions)) {
				url += '&' + join(map(restrictions, restriction => `restriction=${restriction}`), '&');
			}
		}

		return http.get(url);
	},

	getSipgateIo: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/sipgateio`),

	setSipgateIo: (userId, phonelineId, sipgateIo) =>
		http.put(`/${userId}/phonelines/${phonelineId}/sipgateio`, sipgateIo),

	getSipgateIoLog: (userId, phonelineId) =>
		http.get(`/${userId}/phonelines/${phonelineId}/sipgateio/log`),

	getUserInfo: () =>
		http.get('/authorization/userinfo'),

	getLocalprefix: deviceId => http.get(`/devices/${deviceId}/localprefix`),

	setLocalprefix: (deviceId, localprefix, active) =>
		http.put(`/devices/${deviceId}/localprefix`, { value: localprefix, active }),

	activateSim: (userId, deviceId, simId) =>
		http.post(`/${userId}/devices/${deviceId}/sim`, { simId }),

	deactivateSim: (userId, deviceId) =>
		http.del(`/${userId}/devices/${deviceId}/sim`),

	getContingents: (userId, deviceId) =>
		http.get(`/${userId}/devices/${deviceId}/contingents`),

	orderSim: (userId, deviceId, addressId) =>
		http.post(`/${userId}/devices/${deviceId}/sim/orders`, { addressId }),

	getSingleRowDisplay: deviceId =>
		http.get(`/devices/${deviceId}/singlerowdisplay`),

	setSingleRowDisplay: (deviceId, enabled) =>
		http.put(`/devices/${deviceId}/singlerowdisplay`, { enabled }),
});
