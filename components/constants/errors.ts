export type customErrorObj = {
  text: string;
};

const customErrors: { [key: string]: customErrorObj } = {
  FAILED_CREATE: {
    text: "Create failed",
  },
  FAILED_EDIT: {
    text: "Editing failed",
  },
  FAILED_MOVE: {
    text: "Move failed",
  },
  FAILED_DELETE: {
    text: "Delete failed",
  },
};

export default customErrors;
