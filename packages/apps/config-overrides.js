const { override } = require("customize-cra");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = override(function(config, env) {
    // include lib
    config.module.rules.forEach(rule => {
        if (!Reflect.has(rule, 'oneOf')) {
            return false;
        }

        rule.oneOf.forEach(loader => {
            if (loader.test && loader.test.toString().includes('tsx')) {
                loader.include = [
                    path.resolve(__dirname, './src'),
                    path.resolve(__dirname, '../page-wallet/src'),
                    path.resolve(__dirname, '../page-deposit/src'),
                    path.resolve(__dirname, '../page-homa/src'),
                    path.resolve(__dirname, '../page-loan/src'),
                    path.resolve(__dirname, '../page-swap/src'),
                    path.resolve(__dirname, '../page-overview/src'),
                    path.resolve(__dirname, '../page-governance/src'),
                    path.resolve(__dirname, '../react-components/src'),
                    path.resolve(__dirname, '../react-environment/src'),
                    path.resolve(__dirname, '../react-hooks/src'),
                    path.resolve(__dirname, '../ui-components/src')
                ]
            }
        });
    });
    // remove ModuleScoplePlugin
    config.resolve.plugins = config.resolve.plugins.filter(
        plugin => !(plugin instanceof ModuleScopePlugin)
    );
    config.resolve.alias = {
        "@acala-dapp/apps": path.resolve(__dirname, "src"),
        "@acala-dapp/page-wallet": path.resolve(__dirname, "../page-wallet/src"),
        "@acala-dapp/page-deposit": path.resolve(__dirname, "../page-deposit/src"),
        "@acala-dapp/page-homa": path.resolve(__dirname, "../page-homa/src"),
        "@acala-dapp/page-loan": path.resolve(__dirname, "../page-loan/src"),
        "@acala-dapp/page-swap": path.resolve(__dirname, "../page-swap/src"),
        "@acala-dapp/page-governance": path.resolve(__dirname, "../page-governance/src"),
        "@acala-dapp/page-overview": path.resolve(__dirname, "../page-overview/src"),
        "@acala-dapp/react-components": path.resolve(__dirname, "../react-components/src"),
        "@acala-dapp/react-environment": path.resolve(__dirname, "../react-environment/src"),
        "@acala-dapp/react-hooks": path.resolve(__dirname, "../react-hooks/src"),
        "@acala-dapp/ui-components": path.resolve(__dirname, "../ui-components/src")
    };
    return config;
});