from .models import SpotifyToken

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    # expires_in = 