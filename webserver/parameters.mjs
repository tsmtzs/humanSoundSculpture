// ////////////////////////////////////////////////////////////
// Human Sound Sculpture
//
// ////////////////////////////////////////////////////////////
const IP = '192.168.1.8'
const WEB_SERVER_PORT = 3000
const OSC_SERVER = {
		PORT: 57121,
		IP: '0.0.0.0'
}
const OSC_CLIENT = {
		PORT: 57120,
		IP: IP,
		PATH: '/action'
}
const WS_MSG_SHUTDOWN = 'shutdown'

export {
		IP,
		WEB_SERVER_PORT,
		OSC_SERVER,
		OSC_CLIENT,
		WS_MSG_SHUTDOWN
}
