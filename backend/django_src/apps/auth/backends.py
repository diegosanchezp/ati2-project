from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

UserModel = get_user_model()

class EmailBackend(ModelBackend):

    def authenticate(self, request, username=None, password=None, **kwargs):

        # username is actually the email, the parameter name is not changed so
        # we can reuse the default authentication form
        emailfield = UserModel.get_email_field_name()
        if username is None:
            username = kwargs.get(emailfield)

        if username is None or password is None:
            return
        try:
            user = UserModel.objects.get(Q(**{emailfield: username}) | Q(**{UserModel.USERNAME_FIELD: username}))
        except UserModel.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            UserModel().set_password(password)
        else:
            if user.check_password(password) and self.user_can_authenticate(user):
                return user



