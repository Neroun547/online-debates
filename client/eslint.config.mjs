// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"

export default withNuxt({
	rules: {
		"@stylistic/indent": ["error", "tab", { SwitchCase: 1 }],
		"@stylistic/indent-binary-ops": ["error", "tab"],
		"@stylistic/no-tabs": "off",
		"@stylistic/quotes": ["error", "double", { avoidEscape: true }],
		"vue/html-indent": "off"
	}
})
