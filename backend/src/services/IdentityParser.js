/**
 * Configurable Institutional Identity Parser
 * Example: 231CS001.faizaan@giet.edu -> roll: 231CS001, name: Faizaan
 */

export class IdentityParser {
  static parse(email, institutionalDomain = 'giet.edu') {
    if (!email || typeof email !== 'string') {
      return { isValid: false, reason: 'Email is required' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const parts = cleanEmail.split('@');

    if (parts.length !== 2) {
      return { isValid: false, reason: 'Invalid email structure' };
    }

    const [localPart, domain] = parts;

    // Check institutional domain
    const isInstitutional = domain === institutionalDomain.toLowerCase();

    // Default structure extraction
    let rollNumber = '';
    let name = '';

    // Patterns e.g. 231CS001.faizaan or 21cse1042
    if (localPart.includes('.')) {
      const subParts = localPart.split('.');
      rollNumber = subParts[0].toUpperCase();
      name = subParts.slice(1).join(' ');
      // Capitalize first letter of name
      name = name.charAt(0).toUpperCase() + name.slice(1);
    } else {
      // Just roll number or username
      rollNumber = localPart.toUpperCase();
      name = localPart;
    }

    return {
      isValid: true,
      email: cleanEmail,
      domain,
      isInstitutional,
      rollNumber,
      name,
      verifiedFormat: isInstitutional && Boolean(rollNumber),
    };
  }
}
