function showLoading() {
  const loadingDOM = 
  `<div id="loading" class="loading-meng">
    <div class="triangle-wrapper">
        <div class="triangle triangle-1"><svg class="triangle-svg" viewBox="0 0 140 141">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon class="triangle-polygon" points="70 6 136 138 4 138"></polygon>
            </g>
        </svg></div>
        <div class="triangle triangle-2"><svg class="triangle-svg" viewBox="0 0 140 141">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon class="triangle-polygon" points="70 6 136 138 4 138"></polygon>
            </g>
        </svg></div>
        <div class="triangle triangle-3"><svg class="triangle-svg" viewBox="0 0 140 141">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon class="triangle-polygon" points="70 6 136 138 4 138"></polygon>
            </g>
        </svg></div>
        <div class="triangle triangle-4"><svg class="triangle-svg" viewBox="0 0 140 141">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon class="triangle-polygon" points="70 6 136 138 4 138"></polygon>
            </g>
        </svg></div>
        <div class="triangle triangle-5"><svg class="triangle-svg" viewBox="0 0 140 141">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <polygon class="triangle-polygon" points="70 6 136 138 4 138"></polygon>
            </g>
        </svg></div>
        <p class="triangle-loading">Loading</p>
    </div>
  </div>`

  if ($('#loading').length > 0) {
    $('#loading').show()
  } else {
    $('#div2d').append($(loadingDOM))
  }
}

function hideLoading() {
  $('#loading').hide()
}
