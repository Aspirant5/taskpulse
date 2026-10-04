export default (req, pid, ev, data) => req.app.get('io').to('p:' + pid).emit(ev, data);
