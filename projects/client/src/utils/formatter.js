export const rupiahFormat = (rp) => {
  const rpStr = rp?.toString();
  let formatted = "";
  for (let i = 0; i <= rpStr?.length - 1; i++) {
    if (i > 0 && (rpStr?.length - i) % 3 === 0) {
      formatted += ".";
    }
    formatted += rpStr[i];
  }

  return `Rp. ${formatted},00`;
};

export const weightFormat = (gr) => {
  const rpStr = gr?.toString();
  let formatted = "";
  for (let i = 0; i <= rpStr?.length - 1; i++) {
    if (i > 0 && (rpStr?.length - i) % 3 === 0) {
      formatted += ".";
    }
    formatted += rpStr[i];
  }

  return `${formatted} gr`;
};
