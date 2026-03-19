import requests
from django.conf import settings

def send_otp_email(to_email, otp):
    url = "https://api.brevo.com/v3/smtp/email"
    
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json"
    }

    payload = {
        "sender": {
            "name": settings.BREVO_SENDER_NAME,
            "email": settings.BREVO_SENDER_EMAIL 
        },
        "to": [
            {
                "email": to_email
            }
        ],
        "subject": "Your Password Reset Code",
        "htmlContent": f"<html><body><div style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #fff7ed; border-radius: 10px;'><h2 style='color: #f08a5d; text-align: center;'>Password Reset Output</h2><p style='color: #333;'>Hello,</p><p style='color: #333;'>We received a request to reset your password for your Graphura AI account. Your verification code is:</p><div style='text-align: center; margin: 30px 0;'><span style='background-color: #fff; border: 2px solid #f08a5d; color: #f08a5d; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;'>{otp}</span></div><p style='color: #333;'>This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p><p style='color: #333;'>Best Regards,<br>Graphura AI Team</p></div></body></html>"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending email: {e}")
        if getattr(e, 'response', None) is not None:
            print(f"Response: {e.response.text}")
        return False
