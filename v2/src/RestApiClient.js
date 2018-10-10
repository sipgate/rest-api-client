import { map, reduce, join } from 'lodash';

export default class RestApiClient {
	http = null;

	constructor(http = null) {
		this.http = http;
	}

	getTranslations = locale =>
		this.http.getUnauthenticated(`/translations/${locale}`);

	destroySession = () => this.http.del('/authorization/token');

	getAddresses = () => this.http.get('/addresses');

	getFaxlines = userId => this.http.get(`/${userId}/faxlines`);

	getCallRestrictions = userId => this.http.get(`/${userId}/callrestrictions`);

	setCallRestrictions = (userId, restriction, enabled) =>
		this.http.post(`/${userId}/callrestrictions/${restriction}`, { enabled });

	getFaxlineNumbers = (userId, faxlineId) =>
		this.http.get(`/${userId}/faxlines/${faxlineId}/numbers`);

	setFaxlineAlias = (userId, faxlineId, alias) =>
		this.http.put(`/${userId}/faxlines/${faxlineId}`, { alias });

	setFaxlineTagline = (userId, faxlineId, tagline) =>
		this.http.put(`/${userId}/faxlines/${faxlineId}/tagline`, {
			value: tagline,
		});

	createFaxline = userId => this.http.post(`/${userId}/faxlines`);

	deleteFaxline = (userId, faxlineId) =>
		this.http.del(`/${userId}/faxlines/${faxlineId}`);

	getFaxlineCallerId = (userId, faxlineId) =>
		this.http.get(`/${userId}/faxlines/${faxlineId}/callerid`);

	setFaxlineCallerId = (userId, faxlineId, callerId) =>
		this.http.put(`/${userId}/faxlines/${faxlineId}/callerid`, {
			value: callerId,
		});

	getPhonelines = userId => this.http.get(`/${userId}/phonelines`);

	createPhoneline = userId => this.http.post(`/${userId}/phonelines`);

	deletePhoneline = (userId, phonelineId) =>
		this.http.del(`/${userId}/phonelines/${phonelineId}`);

	setPhonelineAlias = (userId, phonelineId, alias) =>
		this.http.put(`/${userId}/phonelines/${phonelineId}`, { alias });

	createPhonelineDevice = (userId, phonelineId, deviceId) =>
		this.http.post(`/${userId}/phonelines/${phonelineId}/devices`, {
			deviceId,
		});

	deletePhonelineDevice = (userId, phonelineId, deviceId) =>
		this.http.del(`/${userId}/phonelines/${phonelineId}/devices/${deviceId}`);

	getPhonelineDevices = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/devices`);

	getPhonelineForwardings = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/forwardings`);

	getPhonelineNumbers = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/numbers`);

	getPhonelineParallelforwardings = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/parallelforwardings`);

	createPhonelineParallelforwarding = (
		userId,
		phonelineId,
		alias,
		destination
	) =>
		this.http.post(`/${userId}/phonelines/${phonelineId}/parallelforwardings`, {
			alias,
			destination,
			active: true,
		});

	setPhonelineParallelforwarding = (
		userId,
		phonelineId,
		parallelforwardingId,
		parallelforwarding
	) =>
		this.http.put(
			`/${userId}/phonelines/${phonelineId}/parallelforwardings/${parallelforwardingId}`,
			parallelforwarding
		);

	getPhonelineVoicemails = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/voicemails`);

	getPhonelineVoicemailGreetings = (userId, phonelineId, voicemailId) =>
		this.http.get(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`
		);

	setVoicemail = (
		userId,
		phonelineId,
		voicemailId,
		active,
		timeout,
		transcription
	) =>
		this.http.put(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}`,
			{ timeout, active, transcription }
		);

	getUser = userId => this.http.get(`/users/${userId}`);

	deleteUser = userId => this.http.del(`/users/${userId}`);

	setDefaultDevice = (userId, deviceId) =>
		this.http.put(`/users/${userId}/defaultdevice`, { deviceId });

	getUsers = () => this.http.get('/users/');

	activateGreeting = (userId, phonelineId, voicemailId, greetingId) =>
		this.http.put(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`,
			{
				active: true,
			}
		);

	createGreeting = (
		userId,
		phonelineId,
		voicemailId,
		filename,
		base64Content
	) =>
		this.http.post(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings`,
			{ filename, base64Content }
		);

	deleteGreeting = (userId, phonelineId, voicemailId, greetingId) =>
		this.http.del(
			`/${userId}/phonelines/${phonelineId}/voicemails/${voicemailId}/greetings/${greetingId}`
		);

	changeForwarding = (userId, phonelineId, forwardings) =>
		this.http.put(`/${userId}/phonelines/${phonelineId}/forwardings`, {
			forwardings,
		});

	setDeviceSettings = (deviceId, dnd, emergencyAddressId) =>
		this.http.put(`/devices/${deviceId}`, { dnd, emergencyAddressId });

	setDeviceAlias = (deviceId, alias) =>
		this.http.put(`/devices/${deviceId}/alias`, { value: alias });

	resetDevicePassword = deviceId =>
		this.http.post(`/devices/${deviceId}/credentials/password`);

	getDevices = userId => this.http.get(`/${userId}/devices`);

	getDevice = deviceId => this.http.get(`/devices/${deviceId}`);

	createDevice = (userId, type) =>
		this.http.post(`/${userId}/devices`, { type });

	createDeviceExternal = (userId, alias, number) =>
		this.http.post(`/${userId}/devices/external`, { alias, number });

	deleteDevice = deviceId => this.http.del(`/devices/${deviceId}`);

	getTacs = () => this.http.get('/app/tacs');

	fetchLinks = () => this.http.get('/app/links');

	getHistory = (connectionIds, types, directions, limit, archived) => {
		let url = `/history?limit=${limit}`;
		if (typeof archived !== 'undefined') {
			url += `&archived=${archived}`;
		}

		url += reduce(types, (joined, type) => `${joined}&types=${type}`, '');
		url += reduce(
			directions,
			(joined, direction) => `${joined}&directions=${direction}`,
			''
		);
		url += reduce(
			connectionIds,
			(joined, connectionId) => `${joined}&connectionIds=${connectionId}`,
			''
		);

		return this.http.get(url);
	};

	getHistoryEntry = entryId => this.http.get(`/history/${entryId}`);

	setHistoryEntryArchivedState = (entryId, archived) =>
		this.http.put(`/history/${entryId}/archive`, { value: archived });

	setHistoryItemReadState = (entryId, readState) =>
		this.http.put(`/history/${entryId}/read`, { value: readState });

	setHistoryItemNote = (entryId, note) =>
		this.http.put(`/history/${entryId}/note`, { note });

	deleteHistoryEntry = id => this.http.del(`/history/${id}`);

	getEvents = () => this.http.get('/app/events');

	deleteEvent = id => this.http.del(`/app/events/${id}`);

	getAppProperties = () => this.http.get('/app/properties');

	getCallerId = deviceId => this.http.get(`/devices/${deviceId}/callerid`);

	setCallerId = (deviceId, callerId) =>
		this.http.put(`/devices/${deviceId}/callerid`, {
			value: callerId,
		});

	getTariffAnnouncement = deviceId =>
		this.http.get(`/devices/${deviceId}/tariffannouncement`);

	setTariffAnnouncement = (deviceId, enabled) =>
		this.http.put(`/devices/${deviceId}/tariffannouncement`, { enabled });

	getNumbers = userId => this.http.get(`/${userId}/numbers`);

	setNumberRouting = (numberId, endpointId) =>
		this.http.put(`/numbers/${numberId}`, { endpointId });

	setNumberSettings = (numberId, endpointId, releaseForMnp, isQuickDial) =>
		this.http.put(`/numbers/${numberId}`, {
			endpointId,
			releaseForMnp,
			quickDial: isQuickDial,
		});

	getPortings = () => this.http.get('/portings');

	getPorting = portingId => this.http.get(`/portings/${portingId}`);

	revokePorting = portingId => this.http.del(`/portings/${portingId}`);

	setWelcome = enabled => this.http.put('/app/properties/welcome', { enabled });

	initiateClickToDial = (caller, callee) =>
		this.http.post('/sessions/calls', { caller, callee });

	getPhonelineBlockAnonymous = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/blockanonymous`);

	setPhonelineBlockAnonymous = (userId, phonelineId, enabled, target) =>
		this.http.put(`/${userId}/phonelines/${phonelineId}/blockanonymous`, {
			enabled,
			target,
		});

	getContacts = () => this.http.get('/contacts');

	getInternalContacts = () => this.http.get('/contacts/internal');

	deleteContact = contactId => this.http.del(`/contacts/${contactId}`);

	deleteAllContacts = () => this.http.del('/contacts');

	importContactsFromCSV = base64Content =>
		this.http.post('/contacts/import/csv', { base64Content });

	importContactsFromGoogle = token =>
		this.http.post('/contacts/import/google', { token });

	fetchSms = userId => this.http.get(`/${userId}/sms`);

	setSmsAlias = (userId, smsId, alias) =>
		this.http.put(`/${userId}/sms/${smsId}`, { alias });

	fetchSmsCallerIds = (userId, smsId) =>
		this.http.get(`/${userId}/sms/${smsId}/callerids`);

	createSmsCallerId = (userId, smsId, phonenumber) =>
		this.http.post(`/${userId}/sms/${smsId}/callerids`, { phonenumber });

	verifySmsCallerId = (userId, smsId, callerId, verificationCode) =>
		this.http.post(
			`/${userId}/sms/${smsId}/callerids/${callerId}/verification`,
			{ verificationCode }
		);

	setActiveSmsCallerId = (userId, smsId, callerId, defaultNumber) =>
		this.http.put(`/${userId}/sms/${smsId}/callerids/${callerId}`, {
			defaultNumber,
		});

	sendFax = (faxlineId, recipient, filename, base64Content) =>
		this.http.post('/sessions/fax', {
			faxlineId,
			recipient,
			filename,
			base64Content,
		});

	resendFax = (faxlineId, faxId) =>
		this.http.post('/sessions/fax/resend', { faxlineId, faxId });

	sendSms = (smsId, recipient, message) =>
		this.http.post('/sessions/sms', { smsId, recipient, message });

	getIdentityVerification = () => this.http.get('/identityVerification');

	getAccount = () => this.http.get('/account');

	verifyAccount = verificationCode =>
		this.http.put('/account/verified', { verificationCode });

	getShortTermVerificationStatus = () =>
		this.http.get('/account/verification/shortterm');

	initiateShortTermVerification = phoneNumber =>
		this.http.post('/account/verification/shortterm', { phoneNumber });

	validateShortTermVerificationCode = code =>
		this.http.put(`/account/verification/shortterm/${code}`);

	getBalance = () => this.http.get('/balance');

	getNotifications = userId => this.http.get(`/${userId}/notifications`);

	deleteNotification = (userId, notificationId) =>
		this.http.del(`/${userId}/notifications/${notificationId}`);

	createVoicemailEmailNotification = (userId, voicemailId, email) =>
		this.http.post(`/${userId}/notifications/voicemail/email`, {
			voicemailId,
			email,
		});

	createVoicemailSmsNotification = (userId, voicemailId, number) =>
		this.http.post(`/${userId}/notifications/voicemail/sms`, {
			voicemailId,
			number,
		});

	createFaxEmailNotification = (userId, faxlineId, email, direction) =>
		this.http.post(`/${userId}/notifications/fax/email`, {
			faxlineId,
			email,
			direction,
		});

	createFaxSmsNotification = (userId, faxlineId, number, direction) =>
		this.http.post(`/${userId}/notifications/fax/sms`, {
			faxlineId,
			number,
			direction,
		});

	createCallEmailNotification = (userId, endpointId, email, direction, cause) =>
		this.http.post(`/${userId}/notifications/call/email`, {
			endpointId,
			email,
			direction,
			cause,
		});

	createCallSmsNotification = (userId, endpointId, number, direction, cause) =>
		this.http.post(`/${userId}/notifications/call/sms`, {
			endpointId,
			number,
			direction,
			cause,
		});

	createFaxReportNotification = (userId, faxlineId, email) =>
		this.http.post(`/${userId}/notifications/fax/report`, { faxlineId, email });

	createSmsEmailNotification = (userId, endpointId, email) =>
		this.http.post(`/${userId}/notifications/sms/email`, { endpointId, email });

	fetchRestrictions = (userId, restrictions) => {
		let url = '/restrictions';
		if (typeof userId === 'string') {
			url += `/?userId=${userId}`;
			if (typeof restrictions === 'string') {
				url += `&${restrictions}`;
			} else if (Array.isArray(restrictions)) {
				url += `&${join(
					map(restrictions, restriction => `restriction=${restriction}`),
					'&'
				)}`;
			}
		}

		return this.http.get(url);
	};

	getWebhooks = () => this.http.get('/settings/sipgateio');

	setWebhooks = settings => this.http.put('/settings/sipgateio', settings);

	getSipgateIo = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/sipgateio`);

	setSipgateIo = (userId, phonelineId, sipgateIo) =>
		this.http.put(`/${userId}/phonelines/${phonelineId}/sipgateio`, sipgateIo);

	getSipgateIoLog = (userId, phonelineId) =>
		this.http.get(`/${userId}/phonelines/${phonelineId}/sipgateio/log`);

	getWebhooksLog = () => this.http.get('/log/webhooks');

	getUserInfo = () => this.http.get('/authorization/userinfo');

	getLocalprefix = deviceId =>
		this.http.get(`/devices/${deviceId}/localprefix`);

	setLocalprefix = (deviceId, localprefix, active) =>
		this.http.put(`/devices/${deviceId}/localprefix`, {
			value: localprefix,
			active,
		});

	activateSim = (userId, deviceId, simId) =>
		this.http.post(`/${userId}/devices/${deviceId}/sim`, { simId });

	deactivateSim = (userId, deviceId) =>
		this.http.del(`/${userId}/devices/${deviceId}/sim`);

	getContingents = (userId, deviceId) =>
		this.http.get(`/${userId}/devices/${deviceId}/contingents`);

	orderSim = (userId, deviceId, addressId) =>
		this.http.post(`/${userId}/devices/${deviceId}/sim/orders`, { addressId });

	getSingleRowDisplay = deviceId =>
		this.http.get(`/devices/${deviceId}/singlerowdisplay`);

	setSingleRowDisplay = (deviceId, enabled) =>
		this.http.put(`/devices/${deviceId}/singlerowdisplay`, { enabled });

	setTargetNumberForExternalDevice = (deviceId, number) =>
		this.http.put(`/devices/${deviceId}/external/targetnumber`, { number });

	setIncomingCallDisplayForExternalDevice = (deviceId, incomingCallDisplay) =>
		this.http.put(`/devices/${deviceId}/external/incomingcalldisplay`, {
			incomingCallDisplay,
		});

	getGroups = userId => {
		let url = '/groups';
		if (typeof userId === 'string') {
			url += `?userId=${userId}`;
		}
		return this.http.get(url);
	};

	getGroupNumbers = groupId => this.http.get(`/groups/${groupId}/numbers`);

	getGroupUsers = groupId => this.http.get(`/groups/${groupId}/users`);

	createGroupDevice = (groupId, deviceId) =>
		this.http.post(`/groups/${groupId}/devices`, { deviceId });

	deleteGroupDevice = (groupId, deviceId) =>
		this.http.del(`/groups/${groupId}/devices/${deviceId}`);

	getGroupVoicemail = groupId => this.http.get(`/groups/${groupId}/voicemail`);

	getGroupFaxline = userId => {
		let url = '/groupfaxlines';
		if (typeof userId === 'string') {
			url += `?userId=${userId}`;
		}
		return this.http.get(url);
	};

	getGroupFaxlineCallerId = faxlineId =>
		this.http.get(`/groupfaxlines/${faxlineId}/callerid`);

	getGroupFaxlineNumbers = faxlineId =>
		this.http.get(`/groupfaxlines/${faxlineId}/numbers`);

	validateQuickDialNumbers = quickDialNumber =>
		this.http.get(`/numbers/quickdial/validation/${quickDialNumber}`);

	createQuickDialNumber = (userId, number) =>
		this.http.post('/numbers/quickdial', { userId, number });

	setQuickDialNumber = (userId, numberId, number) =>
		this.http.put(`/numbers/quickdial/${numberId}`, { userId, number });

	deleteQuickDialNumber = numberId =>
		this.http.del(`/numbers/quickdial/${numberId}`);

	getIncomingBlacklistEntries = () => this.http.get('/blacklist/incoming');

	createIncomingBlacklistEntry = phoneNumber =>
		this.http.post('/blacklist/incoming', { phoneNumber });

	deleteIncomingBlacklistEntry = phoneNumber =>
		this.http.del(`/blacklist/incoming/${phoneNumber}`);

	updateSnomConfig = (configuration, macAddress) =>
		this.http.put('/phoneprovisioning/configuration', {
			configuration,
			macAddress,
		});

	getProvisionedPhones = () => this.http.get('/phoneprovisioning');

	getOAuth2Clients = () => this.http.get('/authorization/oauth2/clients');

	getAutocrediting = () => this.http.get('/payment/autocrediting');

	getPaymentMethods = () => this.http.get('/payment/paymentmethods');

	deletePaymentMethod = id => this.http.del(`/payment/paymentmethod/${id}`);

	createDebitSepa = (holder, iban, bic) =>
		this.http.post('/payment/paymentmethod/debitsepa', { holder, iban, bic });

	createCreditCard = (holder, number, expMonth, expYear, cvc) =>
		this.http.post('/payment/paymentmethod/creditcard', {
			holder,
			number,
			expMonth,
			expYear,
			cvc,
		});

	deleteOAuth2Client = clientId =>
		this.http.del(`/authorization/oauth2/clients/${clientId}`);

	createOAuth2Client = client =>
		this.http.post('/authorization/oauth2/clients', client);

	setOAuth2Client = (clientId, client) =>
		this.http.put(`/authorization/oauth2/clients/${clientId}`, client);

	getAutoRecordingSetting = deviceId =>
		this.http.get(`/autorecordings/${deviceId}/settings`);

	setAutoRecordingSetting = (deviceId, active) =>
		this.http.put(`/autorecordings/${deviceId}/settings`, { active });

	getCrmBridgeSupportedCrms = () => this.http.get('/crm-bridge/crms');

	getCrmBridgeTokens = () => this.http.get('/crm-bridge/tokens');

	createCrmBridgeToken = (crm, token, url) =>
		this.http.post('/crm-bridge/tokens', { crm, token, url });

	deleteCrmBridgeToken = id => this.http.del(`/crm-bridge/tokens/${id}`);

	updateCrmBridgeToken = (id, crm, token, url) =>
		this.http.put(`/crm-bridge/tokens/${id}`, { crm, token, url });

	createContact = contact => this.http.post(`/contacts`, contact);
}
