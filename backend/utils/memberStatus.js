function getMemberStatus(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!expiryDate) {
    return "Expired";
  }

  const expiry = new Date(expiryDate);

  if (isNaN(expiry.getTime())) {
    return "Expired";
  }

  expiry.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return "Expired";
  }

  if (diffDays <= 7) {
    return "Expiring Soon";
  }

  return "Active";
}

module.exports = getMemberStatus;