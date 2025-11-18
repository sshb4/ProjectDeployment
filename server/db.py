

def validatePassword(self, email, password):
    stored_password = self.getUserPasswordByEmaikl(email)
    if stored_password is not None:
        
