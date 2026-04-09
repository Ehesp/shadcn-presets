import * as React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, PaletteIcon } from "lucide-react";
import { presetToShadcnThemeCss } from "shadcn-presets";

import "./index.css";

const INJECTED_STYLE_ID = "shadcn-presets-example-theme";

export function App() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [presetInput, setPresetInput] = React.useState("b0");
  const [error, setError] = React.useState<string | null>(null);
  const [appliedPreset, setAppliedPreset] = React.useState<string | null>(null);
  const [darkMode, setDarkMode] = React.useState(false);
  const [selectDemo, setSelectDemo] = React.useState("neutral");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const applyPreset = React.useCallback(() => {
    const code = presetInput.trim();
    setError(null);
    const css = presetToShadcnThemeCss(code);
    if (!css) {
      setError("Invalid preset code or theme could not be resolved.");
      return;
    }
    let el = document.getElementById(INJECTED_STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = INJECTED_STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
    setAppliedPreset(code);
    setDialogOpen(false);
  }, [presetInput]);

  return (
    <div className="relative z-10 mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <Badge>shadcn-presets</Badge>
        <Badge variant="secondary">preset → CSS</Badge>
        {appliedPreset ? (
          <Badge variant="outline" className="font-mono">
            {appliedPreset}
          </Badge>
        ) : null}
      </div>

      <div className="space-y-8">
        <Alert>
          <InfoIcon />
          <AlertTitle>Semantic tokens follow your preset</AlertTitle>
          <AlertDescription>
            Buttons, inputs, and alerts below use the same CSS variables as shadcn create. Apply a
            preset to recolor the whole page.
          </AlertDescription>
        </Alert>

        <Card className="text-left">
          <CardHeader className="gap-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Theme from preset string</CardTitle>
                <CardDescription className="mt-2">
                  Decode a shadcn create preset (e.g.{" "}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">b0</code>) and
                  inject the same semantic CSS variables used in the create preview.
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDarkMode((d) => !d)}
              >
                {darkMode ? "Light" : "Dark"} mode
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <PaletteIcon className="size-4" />
                <span>Quick preview</span>
              </div>
              <div className="bg-muted/30 rounded-lg border p-4">
                <p className="text-muted-foreground mb-3 text-sm">Buttons & text</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive" size="sm">
                    Destructive
                  </Button>
                  <span className="text-muted-foreground text-sm">Muted label</span>
                </div>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="forms" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
              </TabsList>
              <TabsContent value="forms" className="mt-4 space-y-4">
                <div className="grid gap-2 sm:max-w-sm">
                  <Label htmlFor="demo-email">Email</Label>
                  <Input
                    id="demo-email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo-notes">Notes</Label>
                  <Textarea
                    id="demo-notes"
                    placeholder="Type something…"
                    rows={3}
                    className="resize-y"
                  />
                </div>
                <div className="grid gap-2 sm:max-w-xs">
                  <Label>Sample select</Label>
                  <Select value={selectDemo} onValueChange={setSelectDemo}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick a base" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="zinc">Zinc</SelectItem>
                      <SelectItem value="stone">Stone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="tokens" className="text-muted-foreground mt-4 space-y-2 text-sm">
                <p>
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    --primary
                  </code>
                  ,{" "}
                  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                    --background
                  </code>
                  , chart colors, and radii all come from the merged theme when you apply a valid
                  preset.
                </p>
              </TabsContent>
            </Tabs>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">Enter preset code…</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply preset</DialogTitle>
                    <DialogDescription>
                      Paste a preset string from shadcn create. Try{" "}
                      <span className="font-mono">b0</span> or encode your own design in the CLI.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="grid gap-2">
                      <Label htmlFor="preset">Preset code</Label>
                      <Input
                        id="preset"
                        value={presetInput}
                        onChange={(e) => setPresetInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyPreset()}
                        placeholder="e.g. b0"
                        className="font-mono"
                        autoComplete="off"
                        spellCheck={false}
                      />
                    </div>
                    {error ? <p className="text-destructive text-sm">{error}</p> : null}
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={applyPreset}>
                      Apply theme
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <p className="text-muted-foreground text-sm">
                Opens a <span className="text-foreground font-medium">Dialog</span> with{" "}
                <span className="text-foreground font-medium">Input</span> +{" "}
                <span className="text-foreground font-medium">Label</span>.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 border-t pt-6 sm:flex-row sm:justify-between">
            <p className="text-muted-foreground text-xs">
              Variables are injected into a{" "}
              <code className="font-mono">&lt;style id=&quot;{INJECTED_STYLE_ID}&quot;&gt;</code>{" "}
              tag.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default App;
