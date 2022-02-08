class Account {

	static getToken() {
		return localStorage.getItem('token')
	}

	static setToken(token) {
		localStorage.setItem('token', token);
	}

	static getResetToken() {
		return localStorage.getItem('reset-token')
	}

	static setResetToken(token) {
		localStorage.setItem('reset-token', token);
	}

	static getLang() {
		return localStorage.getItem('lang')
	}

	static setLang(lang) {
		localStorage.setItem('lang', lang);
	}

	static delete() {
		localStorage.removeItem('token');
		localStorage.removeItem('reset-token');
	}
}

export default Account
