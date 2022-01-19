import YAML from 'yaml';
import fs from 'fs';
export default class Config {

    private static getConfig(): any {
        const config = YAML.parse(fs.readFileSync('config.yaml', 'utf8'));
        return config;
    }

    public static getValue(key: string): string {
    
        const config = this.getConfig();
        return config[key];
    
    }

    public static setValue(key: string, value: string): void {
        const config = this.getConfig();
        config[key] = value;
        fs.writeFileSync('config.yml', YAML.stringify(config));
    }
}