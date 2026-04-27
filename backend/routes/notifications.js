app.post('/registerFCMToken', async (req, res) => {
  const { userId, fcmToken } = req.body;
  try {
  await NotificationToken.storeToken(userId, fcmToken);
  res.json({ success: true });
} catch (error) {
    res.status(500).json({ success: false, error: error.message });
}
});