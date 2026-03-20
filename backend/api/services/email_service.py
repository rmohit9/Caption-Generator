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

def send_signup_otp_email(to_email, otp):
    print(f"Attempting to send signup OTP to {to_email} with code {otp}")
    print(f"Brevo API Key configured: {bool(getattr(settings, 'BREVO_API_KEY', None))}")
    print(f"Sender email: {getattr(settings, 'BREVO_SENDER_EMAIL', None)}")
    
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
        "subject": "Verify Your Email - Graphura AI",
        "htmlContent": f"<html><body><div style='font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #fff7ed; border-radius: 10px;'><h2 style='color: #f08a5d; text-align: center;'>Welcome to Graphura AI!</h2><p style='color: #333;'>Hello,</p><p style='color: #333;'>Thank you for signing up for Graphura AI! To complete your registration, please verify your email address using the code below:</p><div style='text-align: center; margin: 30px 0;'><span style='background-color: #fff; border: 2px solid #f08a5d; color: #f08a5d; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;'>{otp}</span></div><p style='color: #333;'>This verification code will expire in <strong>10 minutes</strong>. If you did not sign up for a Graphura AI account, please ignore this email.</p><p style='color: #333;'>Best Regards,<br>Graphura AI Team</p></div></body></html>"
    }

    try:
        print(f"Making request to Brevo API...")
        response = requests.post(url, json=payload, headers=headers)
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.text}")
        
        response.raise_for_status()
        print("Email sent successfully!")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending signup email: {e}")
        if getattr(e, 'response', None) is not None:
            print(f"Response: {e.response.text}")
        return False

def send_admin_alert_email(subject, message):
    from django.contrib.auth.models import User
    
    # Get all users who have is_staff=True
    admin_emails = list(User.objects.filter(is_staff=True).values_list('email', flat=True))
    if not admin_emails:
        print("No admin users found to send alert.")
        return False

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
        "to": [{"email": email} for email in admin_emails],
        "subject": subject,
        "htmlContent": f"<html><body><div style='font-family: Arial, sans-serif; padding: 20px;'><h2 style='color: #d9534f;'>System Alert</h2><p>{message}</p></div></body></html>"
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error sending admin alert email: {e}")
        return False
