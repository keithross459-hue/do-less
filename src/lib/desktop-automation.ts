/**
 * Nexus Desktop Automation Module
 * Handles native OS integration, terminal execution, and local security.
 */

export interface DesktopCommand {
  type: 'terminal' | 'file' | 'app' | 'screenshot' | 'clipboard';
  command: string;
  args?: string[];
  sandbox?: boolean;
}

export class DesktopAutomationEngine {
  private static instance: DesktopAutomationEngine;
  private isNative: boolean = false;

  private constructor() {
    // Check if running within Electron
    this.isNative = typeof window !== 'undefined' && (window as any).nexusNative !== undefined;
  }

  public static getInstance(): DesktopAutomationEngine {
    if (!DesktopAutomationEngine.instance) {
      DesktopAutomationEngine.instance = new DesktopAutomationEngine();
    }
    return DesktopAutomationEngine.instance;
  }

  /**
   * Execute a command on the local machine
   */
  public async execute(cmd: DesktopCommand): Promise<any> {
    if (!this.isNative) {
      console.warn("Nexus: Running in Web Mode. Local execution disabled.");
      return { success: false, message: "Native environment not detected" };
    }

    try {
      console.log(`Nexus Native: Executing ${cmd.type} -> ${cmd.command}`);
      const response = await (window as any).nexusNative.executeCommand(cmd);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * Capture the current screen for AI analysis
   */
  public async captureScreen(): Promise<string | null> {
    if (!this.isNative) return null;
    return await (window as any).nexusNative.captureScreen();
  }

  /**
   * Universal Search (Local + Memory)
   */
  public async nexusSearch(query: string) {
    // 1. Search Local via Electron
    const localResults = this.isNative ? await (window as any).nexusNative.searchLocal(query) : [];
    
    // 2. Search Remote/Memory (would call /api/search)
    return {
      local: localResults || [],
      nexus: [
        { id: 'n1', type: 'agent', name: 'Nexus-7', match: 'Primary controller' },
        { id: 'n2', type: 'workflow', name: 'Deploy Pipeline', match: 'Last run 2h ago' }
      ]
    };
  }
}

/**
 * Nexus Voice Controller
 */
export class VoiceController {
  private recognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public startListening(onResult: (text: string) => void) {
    if (!this.recognition) return;
    this.recognition.onresult = (event: any) => {
      const text = event.results[event.results.length - 1][0].transcript;
      onResult(text);
    };
    this.recognition.start();
  }

  public stopListening() {
    if (this.recognition) this.recognition.stop();
  }
}
