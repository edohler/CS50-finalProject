from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver



class User(AbstractUser):

	def serialize(self):
		return {
			"id": self.id,
			"username": self.username,
			"email": self.email,
		}

class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	picture = models.URLField(blank=True)

	def serialize(self):
		return {
			"username": self.user.username,
			"picture": self.picture,
		}

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
	instance.profile.save()




class Contact(models.Model):
	person1 = models.ForeignKey("User", on_delete=models.CASCADE, related_name="p1")
	person2 = models.ForeignKey("User", on_delete=models.CASCADE, related_name="p2")

	def serialize(self):
		return {
			"id": self.id,
			"person1": self.person1.username,
			"person2": self.person2.username
		}


class Message(models.Model):
	contact = models.ForeignKey("Contact", on_delete=models.CASCADE, related_name="contact")
	sender = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sender")
	body = models.CharField(max_length=200)
	timestamp = models.DateTimeField(auto_now_add=True)

	def serialize(self):
		return {
			"id": self.id,
			"contact": self.contact.id,
			"sender": self.sender.username,
			"body": self.body,
			"timestamp": self.timestamp.strftime("%b %d, %I:%M %p"),
		}
