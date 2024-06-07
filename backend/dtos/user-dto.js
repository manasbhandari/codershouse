class useDto {
  id;
  phone;
  name;
  avatar;
  activated;
  createdAt;

  constructor(user) {
    this.id = user._id;
    this.phone = user.phone;
    this.name = user.name;
    this.avatar = user.avatar ? `${user.avatar}` : null;
    this.activated = user.activated;
    this.createdAt = user.createdAt;
  }
}

module.exports = useDto;
