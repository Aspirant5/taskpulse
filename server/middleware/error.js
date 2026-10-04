export const notFound = (req, res) => res.status(404).json({ message: 'Route not found' });

// eslint-disable-next-line no-unused-vars
export const errorHandler = (e, req, res, next) => {
  let s = e.status || 500;
  let m = e.message;
  if (e.name === 'ValidationError') { s = 400; m = Object.values(e.errors).map(x => x.message).join(', '); }
  else if (e.name === 'CastError') { s = 400; m = 'Invalid id'; }
  else if (e.code === 11000) { s = 409; m = 'Duplicate value'; }
  if (s === 500) { console.error(e); m = 'Server error'; }
  res.status(s).json({ message: m });
};
