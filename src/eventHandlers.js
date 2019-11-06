const { sendIssueToSlack, respondToDelete , sendLabelsToSlack, respondToAddPriority} = require('./services/slack');
const { addIssueLabel, deleteComment, addPRLabel , addLabel } = require('./services/github');
const { getToxicity } = require('./services/ml');

exports.issuesAndReviewsCommentHandler = (event) => {
  if (event.payload.action !== 'created') return;
  (async () => {
    const isToxic = await getToxicity(event.payload.comment.body);
    if (isToxic) {
      await sendIssueToSlack(event.payload);
    }
  })();
};

exports.issuesHandler = (event) => {
  if (event.payload.action !== 'opened') return;

  (async () => {
    const labels = await addIssueLabel(event.payload);
    if (labels.includes('bug')) {
      await sendLabelsToSlack(event.payload);
    }
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

exports.addIssueLabelFromSlack = (event) => {
  let label = new Array(event.selectedOption.value);
  (async () => {
    await addLabel(event.payload.owner,event.payload.repo,event.payload.issue_number,label);
    await respondToAddPriority(event,label);
  })();
};




