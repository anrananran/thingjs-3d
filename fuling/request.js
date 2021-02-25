window.request = (options) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: options.type.toUpperCase(),
      url: options.url,
      contentType: 'application/json',
      dataType: 'json',
      data: options.data,
      crossDomain: true,    
      timeout: 20 * 1000,
      success: (res) => {
        resolve(res)
      },
      error: (err) => {
        reject(err)
      }
    })
  })
}
