function loadConfig() {
  return fetch(chrome.runtime.getURL('config.json'))
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error loading config:', error);
      return {};
    });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "addToCalendar") {
    loadConfig().then(config => {
      if (config.authorization && config.user_id && config.saved_item_id) {
        addToCalendar(message.text, config);
      } else {
        console.error('Config is missing required fields');
        alert('エラーが発生しました');
      }
    });
  }
});

function addToCalendar(selectedText, config) {
  const options = {
    method: 'POST',
    headers: {
      'Authorization': config.authorization,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "user_id": config.user_id,
      "saved_item_id": config.saved_item_id,
      "pipeline_inputs": [{"input_name":"input","value": selectedText}]
    })
  };

  fetch('https://api.gumloop.com/api/v1/start_pipeline', options)
    .then(response => {
      if (response.ok) { // 200番台のステータスコード
        return response.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      alert("カレンダーに追加しました");
    })
    .catch(err => {
      console.error('Fetch error:', err);
      alert("エラーが発生しました");
    });
}
