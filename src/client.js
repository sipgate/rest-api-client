import reduce from 'lodash/reduce';

export default (http, saveJWTToken, getUserId, onLogout = () => {}) => ({
	createSession: (username, password) => (
		http.post('/authorization/token', { username, password })
			.then((json) => {
				saveJWTToken(json.token);
				return json;
			})
	),
	destroySession: () => (
		http.del('/authorization/token')
			.then(() => {
				onLogout();
			})
	),
	getTranslations: locale => (http.get(`/translations/${locale}`)),
	getFaxlines: () => (http.get(`/${getUserId()}/faxlines`)),
	getFaxlineNumbers: faxlineId => (http.get(`/${getUserId()}/faxlines/${faxlineId}/numbers`)),
	setFaxlineAlias: (faxlineId, alias) => (http.put(`/${getUserId()}/faxlines/${faxlineId}`, { alias })),
	setFaxlineTagline: (faxlineId, tagline) => (http.put(`/${getUserId()}/faxlines/${faxlineId}/tagline`, { value: tagline })),
	getFaxlineCallerId: faxlineId => (http.get(`/${getUserId()}/faxlines/${faxlineId}/callerid`)),
	setFaxlineCallerId: (faxlineId, callerId) => (http.put(`/${getUserId()}/faxlines/${faxlineId}/callerid`, { value: callerId })),
	getPhonelines: () => (http.get(`/${getUserId()}/phonelines`)),
	setPhonelineAlias: (phonelineId, alias) => (http.put(`/${getUserId()}/phonelines/${phonelineId}`, { alias })),
	getPhonelineDevices: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/devices`)),
	getPhonelineForwardings: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/forwardings`)),
	getPhonelineNumbers: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/numbers`)),
	getPhonelineParallelforwardings: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/parallelforwardings`)),
	createPhonelineParallelforwarding: (phonelineId, alias, destination) => (
		http.post(`/${getUserId()}/phonelines/${phonelineId}/parallelforwardings`, { alias, destination, active: true })
	),
	setPhonelineParallelforwarding: (phonelineId, parallelforwardingId, parallelforwarding) => (
		http.put(`/${getUserId()}/phonelines/${phonelineId}/parallelforwardings/${parallelforwardingId}`, parallelforwarding)
	),
	getPhonelineVoicemails: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/voicemails`)),
	getPhonelineVoicemailGreetings: (phonelineId, voicemailId) => (http.get(`/${getUserId()}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`)),
	setVoicemail: (phonelineId, voicemailId, active, timeout, transcription) => (
		http.put(
			`/${getUserId()}/phonelines/${phonelineId}/voicemails/${voicemailId}`,
			{ timeout, active, transcription },
		)
	),
	getUser: () => (http.get(`/users/${getUserId()}`)),
	activateGreeting: (phonelineId, voicemailId, greetingId) => (
		http.put(
			`/${getUserId()}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`,
			{ active: true },
		)
	),
	createGreeting: (phonelineId, voicemailId, filename, base64Content) => (
		http.post(
			`/${getUserId()}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`,
			{ filename, base64Content },
		)
	),
	deleteGreeting: (phonelineId, voicemailId, greetingId) => (http.del(`/${getUserId()}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`)),
	changeForwarding: (phonelineId, forwardings) => (
		http.put(
			`/${getUserId()}/phonelines/${phonelineId}/forwardings`,
			{ forwardings },
		)
	),
	setDnd: (deviceId, dnd) => (http.put(`/devices/${deviceId}`, { dnd })),
	setDeviceAlias: (deviceId, alias) => (http.put(`/devices/${deviceId}/alias`, { value: alias })),
	resetDevicePassword: deviceId => (http.post(`/devices/${deviceId}/credentials/password`)),
	getDevices: () => (http.get('/devices')),
	getTacs: () => (http.get('/app/tacs')),
	acceptTacs: () => (http.put('/app/tacs', { accepted: true })),
	fetchLinks: () => (http.get('/app/links')),
	getHistory: (phonelineId, types, directions, limit) => {
		let url = `/${getUserId()}/history?phonelineId=${phonelineId}&limit=${limit}`;
		url += reduce(types, (joined, type) => `${joined}&types=${type}`, '');
		url += reduce(directions, (joined, direction) => `${joined}&directions=${direction}`, '');

		return http.get(url);
	},
	deleteHistoryEntry: id => (http.del(`/${getUserId()}/history/${id}`)),
	getEvents: () => (http.get('/app/events')),
	deleteEvent: id => (http.del(`/app/events/${id}`)),
	getCallerId: deviceId => (http.get(`/devices/${deviceId}/callerid`)),
	setCallerId: (deviceId, callerId) => (http.put(`/devices/${deviceId}/callerid`, { value: callerId })),
	getTariffAnnouncement: deviceId => (http.get(`/devices/${deviceId}/tariffannouncement`)),
	setTariffAnnouncement: (deviceId, enabled) => (http.put(`/devices/${deviceId}/tariffannouncement`, { enabled })),
	getNumbers: () => (http.get('/numbers')),
	setNumberRouting: (numberId, endpointId) => (http.put(`/numbers/${numberId}`, { endpointId })),
	getPortings: () => (http.get('/portings')),
	revokePorting: portingId => (http.del(`/portings/${portingId}`)),
	getWelcome: () => (http.get('/app/welcome')),
	setWelcome: enabled => (http.put('/app/welcome', { enabled })),
	initiateClickToDial: (phonelineId, caller, callee) => (http.post('/sessions/calls', { phonelineId, caller, callee })),
	getBlockAnonymous: phonelineId => (http.get(`/${getUserId()}/phonelines/${phonelineId}/blockanonymous`)),
	setBlockAnonymous: (phonelineId, enabled, target) => (http.put(`/${getUserId()}/phonelines/${phonelineId}/blockanonymous`, { enabled, target })),
	getContacts: () => http.get('/contacts'),
	deleteContact: contactId => http.del(`/contacts/${contactId}`),
	deleteAllContacts: () => http.del('/contacts'),
	importContactsFromCSV: base64Content => http.post('/contacts/import/csv', { base64Content }),
	importContactsFromGoogle: token => http.post('/contacts/import/google', { token }),
	fetchSms: () => (http.get(`/${getUserId()}/sms`)),
	setSmsAlias: (smsId, alias) => http.put(`/${getUserId()}/sms/${smsId}`, { alias }),
	fetchSmsCallerIds: smsId => http.get(`/${getUserId()}/sms/${smsId}/callerids`),
	createSmsCallerId: (smsId, phonenumber) => http.post(`/${getUserId()}/sms/${smsId}/callerids`, { phonenumber }),
	verifySmsCallerId: (smsId, callerId, verificationCode) => http.post(`/${getUserId()}/sms/${smsId}/callerids/${callerId}/verification`, { verificationCode }),
	setActiveSmsCallerId: (smsId, callerId, defaultNumber) => http.put(`/${getUserId()}/sms/${smsId}/callerids/${callerId}`, { defaultNumber }),
	sendFax: (faxlineId, recipient, filename, base64Content) => http.post('/sessions/fax', { faxlineId, recipient, filename, base64Content }),
	sendSms: (smsId, recipient, message) => http.post('/sessions/sms', { smsId, recipient, message }),
	getBalance: () => http.get('/balance'),
	getNotifications: () => http.get(`/${getUserId()}/notifications`),
	deleteNotification: notificationId => http.del(`/${getUserId()}/notifications/${notificationId}`),
	createNotification: (endpointId, target, direction) => http.post(`/${getUserId()}/notifications`, { endpointId, target, direction }),
	fetchRestrictions: () => http.get('/restrictions'),
	getSipgateIo: phonelineId => http.get(`/${getUserId()}/phonelines/${phonelineId}/sipgateio`),
	setSipgateIo: (phonelineId, sipgateIo) => http.put(`/${getUserId()}/phonelines/${phonelineId}/sipgateio`, sipgateIo),
	getSipgateIoLog: phonelineId => http.get(`/${getUserId()}/phonelines/${phonelineId}/sipgateio/log`),
});
