const { sendIssueToSlack, respondToDelete } = require('./services/slack');
const { addIssueLabel, deleteComment, addPRLabel } = require('./services/github');
const { getToxicity } = require('./services/ml');

exports.issuesAndReviewsCommentHandler = (event) => {
  // Only handle the created event, reject others.
  if (event.payload.action !== 'created') return;
  (async () => {
    const is_toxic = await getToxicity(event.payload.comment.body);
    if (is_toxic) {
      //console.log("-----------------------------------------Toxic Comment Detected-----------------------------------------")
      await sendIssueToSlack(event.payload);
    }
  })();
};

exports.issuesHandler = (event) => {
  if (event.payload.action !== 'opened') return;

  (async () => {
    await addIssueLabel(event.payload);
  })();
};

exports.deleteCommentHandler = (event) => {
  (async () => {
    await deleteComment(event.payload);
    await respondToDelete(event);
  })();
};

exports.prHandler = (event) => {
  (async () => {
    await addPRLabel(event.payload);
  })();
};


