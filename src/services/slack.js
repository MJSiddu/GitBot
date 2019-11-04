const request = require('request');
const template = require('../templates/toxic_message');
const template_Labels = require('../templates/label_priority');
const template_toxic_updated = require('../templates/toxic_message_updated');

const endpoint = 'https://slack.com/api/chat.postMessage';

exports.sendIssueToSlack = async (payload) => {
  const message = template(payload);
  const options = {
    url: endpoint,
    method: 'POST',
    json: true,
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: {
      channel: 'se-project',
      ...message,
    },
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};


exports.sendLabelsToSlack = async (payload) => {
  const message = template_Labels(payload);
  //console.log(message)
  const options = {
    url: endpoint,
    method: 'POST',
    json: true,
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
    body: {
      channel: 'se-project',
      ...message,
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};

exports.respondToDelete = async (payload) => {
  const message = template_toxic_updated(payload);
  const options = {
    url: payload.response_url,
    json: true,
    method: 'POST',
    body: {
      response_type: 'in_channel',
      replace_original: true,
      ...message,
    },
  };
  return new Promise((resolve, reject) => {
    request(options, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
};
