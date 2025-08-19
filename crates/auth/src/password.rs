use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};

#[derive(Debug, Clone)]
pub struct PasswordService {
    argon2: Argon2<'static>,
}

impl PasswordService {
    pub fn new() -> Self {
        Self {
            argon2: Argon2::default(),
        }
    }

    pub fn hash_password(&self, password: &str) -> Result<String, argon2::password_hash::Error> {
        let salt = SaltString::generate(&mut OsRng);
        let password_hash = self.argon2.hash_password(password.as_bytes(), &salt)?;
        Ok(password_hash.to_string())
    }

    pub fn verify_password(
        &self,
        password: &str,
        hash: &str,
    ) -> Result<bool, argon2::password_hash::Error> {
        let parsed_hash = PasswordHash::new(hash)?;
        match self.argon2.verify_password(password.as_bytes(), &parsed_hash) {
            Ok(()) => Ok(true),
            Err(argon2::password_hash::Error::Password) => Ok(false),
            Err(e) => Err(e),
        }
    }

    pub fn validate_password_strength(&self, password: &str) -> Result<(), Vec<String>> {
        let mut errors = Vec::new();

        if password.len() < 8 {
            errors.push("Password must be at least 8 characters long".to_string());
        }

        if password.len() > 128 {
            errors.push("Password must be no more than 128 characters long".to_string());
        }

        if !password.chars().any(|c| c.is_lowercase()) {
            errors.push("Password must contain at least one lowercase letter".to_string());
        }

        if !password.chars().any(|c| c.is_uppercase()) {
            errors.push("Password must contain at least one uppercase letter".to_string());
        }

        if !password.chars().any(|c| c.is_numeric()) {
            errors.push("Password must contain at least one number".to_string());
        }

        if !password.chars().any(|c| "!@#$%^&*()_+-=[]{}|;:,.<>?".contains(c)) {
            errors.push("Password must contain at least one special character".to_string());
        }

        if errors.is_empty() {
            Ok(())
        } else {
            Err(errors)
        }
    }
}

impl Default for PasswordService {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_password_hashing_and_verification() {
        let password_service = PasswordService::new();
        let password = "TestPassword123!";

        let hash = password_service.hash_password(password).unwrap();
        assert!(password_service.verify_password(password, &hash).unwrap());
        assert!(!password_service.verify_password("wrong_password", &hash).unwrap());
    }

    #[test]
    fn test_password_strength_validation() {
        let password_service = PasswordService::new();

        // Valid password
        assert!(password_service.validate_password_strength("TestPassword123!").is_ok());

        // Too short
        assert!(password_service.validate_password_strength("Test1!").is_err());

        // No uppercase
        assert!(password_service.validate_password_strength("testpassword123!").is_err());

        // No lowercase
        assert!(password_service.validate_password_strength("TESTPASSWORD123!").is_err());

        // No number
        assert!(password_service.validate_password_strength("TestPassword!").is_err());

        // No special character
        assert!(password_service.validate_password_strength("TestPassword123").is_err());
    }
}
