from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from app.core.config import settings_conf


def send_reset_email(email: str, user_first_name: str, token: str):
    message = Mail(
        from_email='no-reply@bancaingressos.com',
        to_emails=email,
        subject='Banca Ingressos: Resete sua senha',
        plain_text_content=f'Clique no link para resetar sua senha: https://bancaingressos.com/reset-password?token={token}&user_name={user_first_name}'
    )

    sg = SendGridAPIClient(settings_conf.SENDGRID_API_KEY)
    response = sg.send(message)

    return response
