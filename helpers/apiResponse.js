exports.successResponse = function (res, msg) {
  const data = {
    error: false,
    message: msg
  }
  return res.status(200).json(data)
}

exports.ErrorResponse = function (res, msg) {
  const data = {
    error: true,
    message: msg
  }
  return res.status(500).json(data)
}

exports.notFoundResponse = function (res, msg) {
  const data = {
    error: true,
    message: msg
  }
  return res.status(404).json(data)
}

exports.validationError = function (res, msg, data) {
  const resData = {
    error: true,
    message: msg,
    data: data
  }
  return res.status(400).json(resData)
}

exports.unauthorizedResponse = function (res, msg) {
  const data = {
    error: true,
    message: msg
  }
  return res.status(401).json(data)
}
