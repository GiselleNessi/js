"use client";

import { DangerSettingCard } from "@/components/blocks/DangerSettingCard";
import { SettingsCard } from "@/components/blocks/SettingsCard";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { DynamicHeight } from "@/components/ui/DynamicHeight";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import type { ApiKey, UpdateKeyInput } from "@3rdweb-sdk/react/hooks/useApi";
import {
  useRevokeApiKey,
  useUpdateApiKey,
} from "@3rdweb-sdk/react/hooks/useApi";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseMutationResult } from "@tanstack/react-query";
import { SERVICES } from "@thirdweb-dev/service-utils";
import {
  type ServiceName,
  getServiceByName,
} from "@thirdweb-dev/service-utils";
import { format } from "date-fns";
import { useTrack } from "hooks/analytics/useTrack";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { type UseFormReturn, useForm } from "react-hook-form";
import { type FieldArrayWithId, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { joinWithComma, toArrFromList } from "utils/string";
import {
  type ApiKeyValidationSchema,
  HIDDEN_SERVICES,
  apiKeyValidationSchema,
} from "../../../../../components/settings/ApiKeys/validations";

type EditProjectUIPaths = {
  inAppConfig: string;
  aaConfig: string;
  payConfig: string;
  afterDeleteRedirectTo: string;
};

export function ProjectGeneralSettingsPage(props: {
  apiKey: ApiKey;
  paths: EditProjectUIPaths;
  onKeyUpdated: (() => void) | undefined;
  wording: "project" | "api-key";
}) {
  const updateMutation = useUpdateApiKey();
  const deleteMutation = useRevokeApiKey();

  return (
    <ProjectGeneralSettingsPageUI
      apiKey={props.apiKey}
      wording={props.wording}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
      paths={props.paths}
      onKeyUpdated={props.onKeyUpdated}
    />
  );
}

type UpdateMutation = UseMutationResult<
  unknown,
  unknown,
  UpdateKeyInput,
  unknown
>;

type DeleteMutation = UseMutationResult<unknown, unknown, string, unknown>;

interface EditApiKeyProps {
  apiKey: ApiKey;
  wording: "project" | "api-key";
  updateMutation: UpdateMutation;
  deleteMutation: DeleteMutation;
  paths: EditProjectUIPaths;
  onKeyUpdated: (() => void) | undefined;
}

type UpdateAPIForm = UseFormReturn<ApiKeyValidationSchema>;

export const ProjectGeneralSettingsPageUI: React.FC<EditApiKeyProps> = (
  props,
) => {
  const { apiKey, wording, updateMutation, deleteMutation } = props;
  const trackEvent = useTrack();
  const router = useDashboardRouter();
  const form = useForm<ApiKeyValidationSchema>({
    resolver: zodResolver(apiKeyValidationSchema),
    defaultValues: {
      name: apiKey.name,
      domains: joinWithComma(apiKey.domains),
      bundleIds: joinWithComma(apiKey.bundleIds),
      redirectUrls: joinWithComma(apiKey.redirectUrls),
      services: SERVICES.map((srv) => {
        const existingService = (apiKey.services || []).find(
          (s) => s.name === srv.name,
        );

        return {
          name: srv.name,
          targetAddresses: existingService
            ? joinWithComma(existingService.targetAddresses)
            : "",
          enabled: !!existingService,
          actions: existingService?.actions || [],
          recoveryShareManagement: existingService?.recoveryShareManagement,
          customAuthentication: existingService?.customAuthentication,
          customAuthEndpoint: existingService?.customAuthEndpoint,
          applicationName: existingService?.applicationName,
          applicationImageUrl: existingService?.applicationImageUrl,
        };
      }),
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    const enabledServices = (values.services || []).filter(
      (srv) => !!srv.enabled,
    );

    if (enabledServices.length > 0) {
      // validate embedded wallets custom auth
      const embeddedWallets = enabledServices.find(
        (s) => s.name === "embeddedWallets",
      );

      if (embeddedWallets) {
        const { customAuthentication, recoveryShareManagement } =
          embeddedWallets;

        if (
          recoveryShareManagement === "USER_MANAGED" &&
          (!customAuthentication?.aud.length ||
            !customAuthentication?.jwksUri.length)
        ) {
          return toast.error("Custom JSON Web Token configuration is invalid", {
            description:
              "To use In-App Wallets with Custom JSON Web Token, provide JWKS URI and AUD.",
          });
        }
      }

      const formattedValues = {
        id: apiKey.id,
        name: values.name,
        domains: toArrFromList(values.domains),
        bundleIds: toArrFromList(values.bundleIds),
        redirectUrls: toArrFromList(values.redirectUrls, true),
        services: (values.services || [])
          .filter((srv) => srv.enabled)
          // FIXME: Not yet supported, add when it is
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .map(({ recoveryShareManagement, ...srv }) => ({
            ...srv,
            targetAddresses: toArrFromList(srv.targetAddresses),
          })),
      };

      trackEvent({
        category: "api-keys",
        action: "edit",
        label: "attempt",
      });

      updateMutation.mutate(formattedValues, {
        onSuccess: () => {
          toast.success(
            `${wording === "project" ? "Project" : "API Key"} updated successfully`,
          );
          trackEvent({
            category: "api-keys",
            action: "edit",
            label: "success",
          });

          props.onKeyUpdated?.();
        },
        onError: (err) => {
          toast.error(
            `Failed to update ${wording === "project" ? "Project" : "API Key"}`,
          );
          trackEvent({
            category: "api-keys",
            action: "edit",
            label: "error",
            error: err,
          });
        },
      });
    } else {
      toast.error("Service not selected", {
        description: "Choose at least one service",
      });
    }
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        autoComplete="off"
      >
        <div className="flex flex-col gap-8">
          <ProjectNameSetting
            form={form}
            updateMutation={updateMutation}
            handleSubmit={handleSubmit}
            wording={wording}
          />

          <APIKeyDetails apiKey={apiKey} />

          <AllowedDomainsSetting
            form={form}
            updateMutation={updateMutation}
            handleSubmit={handleSubmit}
            wording={wording}
          />

          <AllowedBundleIDsSetting
            form={form}
            updateMutation={updateMutation}
            handleSubmit={handleSubmit}
            wording={wording}
          />

          <EnabledServicesSetting
            form={form}
            apiKey={apiKey}
            updateMutation={updateMutation}
            handleSubmit={handleSubmit}
            wording={wording}
            paths={props.paths}
          />

          <DeleteProject
            id={apiKey.id}
            name={apiKey.name}
            deleteMutation={deleteMutation}
            onDeleteSuccessful={() => {
              router.replace(props.paths.afterDeleteRedirectTo);
            }}
            wording={wording}
          />
        </div>
      </form>
    </Form>
  );
};

function ProjectNameSetting(props: {
  form: UpdateAPIForm;
  updateMutation: UpdateMutation;
  handleSubmit: () => void;
  wording: "project" | "api-key";
}) {
  const { form, updateMutation, handleSubmit, wording } = props;
  const isNameDirty = form.getFieldState("name").isDirty;

  return (
    <SettingsCard
      header={{
        title: wording === "project" ? "Project Name" : "Display Name",
        description: `Assign a name to identify your ${
          wording === "project" ? "project" : "API Key"
        } on thirdweb dashboard`,
      }}
      noPermissionText={undefined}
      errorText={form.getFieldState("name").error?.message}
      saveButton={{
        onClick: handleSubmit,
        disabled: !isNameDirty,
        isLoading: updateMutation.isPending && isNameDirty,
      }}
      bottomText="Please use 64 characters at maximum"
    >
      <Input
        autoFocus
        placeholder={wording === "project" ? "My Project" : "My API Key"}
        type="text"
        {...form.register("name")}
        className="bg-background max-w-[350px]"
      />
    </SettingsCard>
  );
}

function AllowedDomainsSetting(props: {
  form: UpdateAPIForm;
  updateMutation: UpdateMutation;
  handleSubmit: () => void;
  wording: "project" | "api-key";
}) {
  const { form, handleSubmit, updateMutation } = props;
  const isDomainsDirty = form.getFieldState("domains").isDirty;

  const helperText = (
    <ul className="list-disc text-sm text-muted-foreground pl-3 [&>li]:pl-1 flex flex-col gap-1.5 py-1">
      <li>
        Authorize all domains with{" "}
        <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
          *
        </span>
        {". "}
        <span>
          Example:{" "}
          <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
            *.thirdweb.com
          </span>{" "}
          accepts all{" "}
          <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
            .thirdweb.com
          </span>{" "}
          sites
        </span>
      </li>
      <li>
        Authorize localhost URLs with{" "}
        <span className="bg-muted text-xs font-mono inline-block px-2 rounded">
          {"localhost:<port>"}
        </span>
      </li>
      <li>Enter domains separated by commas or new lines</li>
    </ul>
  );

  return (
    <SettingsCard
      header={{
        title: "Domain Restrictions",
        description:
          "Only allow Client ID to be used on specific domains to prevent unauthorized use",
      }}
      noPermissionText={undefined}
      errorText={form.getFieldState("domains", form.formState).error?.message}
      saveButton={{
        onClick: handleSubmit,
        disabled: !isDomainsDirty,
        isLoading: updateMutation.isPending && isDomainsDirty,
      }}
      bottomText={"This is only applicable for web applications"}
    >
      <div className="flex flex-col gap-6">
        <div className="relative">
          <Label htmlFor="domains" className="inline-block mb-2">
            Allowed Domains
          </Label>

          <CheckboxWithLabel className="absolute top-0 right-0">
            <Checkbox
              checked={form.watch("domains") === "*"}
              onCheckedChange={(v) => {
                form.setValue("domains", v ? "*" : "", {
                  shouldDirty: true,
                });
              }}
            />
            All Domains
          </CheckboxWithLabel>

          <Textarea
            placeholder="thirdweb.com, rpc.example.com, localhost:3000"
            {...form.register("domains")}
          />
        </div>

        {helperText}

        {!form.watch("domains") && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">No Domains Configured</AlertTitle>
            <AlertDescription>
              This will deny requests from all origins, rendering the key
              unusable in frontend applications. <br /> Proceed only if you
              intend to use this key in server or native apps environments
            </AlertDescription>
          </Alert>
        )}

        {form.watch("domains") === "*" && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">Unrestricted Web Access</AlertTitle>
            <AlertDescription>
              Requests from all origins will be authorized. Your key can be
              misused by other websites
            </AlertDescription>
          </Alert>
        )}
      </div>
    </SettingsCard>
  );
}

function AllowedBundleIDsSetting(props: {
  form: UpdateAPIForm;
  updateMutation: UpdateMutation;
  handleSubmit: () => void;
  wording: "project" | "api-key";
}) {
  const { form, handleSubmit, updateMutation } = props;
  const isBundleIdsDirty = form.getFieldState("bundleIds").isDirty;
  return (
    <SettingsCard
      saveButton={{
        onClick: handleSubmit,
        disabled: !isBundleIdsDirty,
        isLoading: updateMutation.isPending && isBundleIdsDirty,
      }}
      noPermissionText={undefined}
      header={{
        title: "Bundle ID Restrictions",
        description:
          "Only allow Client ID to be used on specific Bundle IDs to prevent unauthorized use",
      }}
      bottomText="This is only applicable for Native games or Native applications"
      errorText={form.getFieldState("bundleIds", form.formState).error?.message}
    >
      <div className="flex flex-col gap-4">
        <div className="relative ">
          <CheckboxWithLabel className="absolute top-0 right-0">
            <Checkbox
              checked={form.watch("bundleIds") === "*"}
              onCheckedChange={(checked) => {
                form.setValue("bundleIds", checked ? "*" : "", {
                  shouldDirty: true,
                });
              }}
            />
            All Bundle IDs
          </CheckboxWithLabel>

          <Label className="inline-block mb-2">Allowed Bundle IDs</Label>

          <Textarea
            placeholder="com.thirdweb.app"
            {...form.register("bundleIds")}
          />
        </div>

        <p className="text-muted-foreground text-sm ">
          Enter bundle ids separated by commas or new lines.
        </p>

        {!form.watch("bundleIds") && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">
              No Bundle IDs Configured
            </AlertTitle>
            <AlertDescription>
              This will deny requests from all native applications, rendering
              the key unusable. Proceed only if you intend to use this key in
              server or frontend environments.
            </AlertDescription>
          </Alert>
        )}
        {form.watch("bundleIds") === "*" && (
          <Alert variant="warning">
            <AlertTitle className="text-sm">Unrestricted App Access</AlertTitle>
            <AlertDescription>
              Requests from all applications will be authorized. If your key is
              leaked it could be misused.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </SettingsCard>
  );
}

function EnabledServicesSetting(props: {
  form: UpdateAPIForm;
  updateMutation: UpdateMutation;
  handleSubmit: () => void;
  wording: "project" | "api-key";
  apiKey: ApiKey;
  paths: EditApiKeyProps["paths"];
}) {
  const { form, handleSubmit, updateMutation, wording } = props;

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "services",
  });
  const handleAction = (
    srvIdx: number,
    srv: FieldArrayWithId<ApiKeyValidationSchema, "services", "id">,
    actionName: string,
    checked: boolean,
  ) => {
    const actions = checked
      ? [...(srv.actions || []), actionName]
      : (srv.actions || []).filter((a) => a !== actionName);

    update(srvIdx, {
      ...srv,
      actions,
    });
  };

  return (
    <SettingsCard
      header={{
        title: "Enabled Services",
        description: `thirdweb services enabled for this ${
          wording === "project" ? "project" : "API Key"
        }`,
      }}
      noPermissionText={undefined}
      errorText={undefined}
      saveButton={{
        onClick: handleSubmit,
        disabled: !form.formState.isDirty,
        isLoading: updateMutation.isPending,
      }}
      bottomText=""
    >
      <DynamicHeight>
        <div className="flex flex-col">
          {fields.map((srv, idx) => {
            const service = getServiceByName(srv.name as ServiceName);
            const hidden = HIDDEN_SERVICES.includes(service.name);
            const serviceName = getServiceByName(service.name as ServiceName);
            const shouldShow = !hidden && serviceName;

            if (!shouldShow) {
              return null;
            }

            let configurationLink: string | undefined;
            if (service.name === "embeddedWallets" && srv.enabled) {
              configurationLink = props.paths.inAppConfig;
            } else if (service.name === "bundler" && srv.enabled) {
              configurationLink = props.paths.aaConfig;
            } else if (service.name === "pay") {
              configurationLink = props.paths.payConfig;
            }

            return (
              <div
                key={srv.name}
                className="border-t py-5 border-border flex items-start gap-6 justify-between"
              >
                {/* Left */}
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-base font-semibold">{service.title}</h4>
                    <p className="text-muted-foreground text-sm">
                      {service.description}
                    </p>
                  </div>

                  {configurationLink && (
                    <div>
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="min-w-32 gap-2 justify-between"
                      >
                        <Link href={configurationLink}>
                          Configure
                          <ExternalLinkIcon className="size-3 text-muted-foreground" />
                        </Link>
                      </Button>
                    </div>
                  )}

                  {service.actions.length > 0 && (
                    <div className="flex gap-4">
                      {service.actions.map((sa) => (
                        <ToolTipLabel key={sa.name} label={sa.description}>
                          <div>
                            <CheckboxWithLabel>
                              <Checkbox
                                checked={srv.actions.includes(sa.name)}
                                onCheckedChange={(checked) =>
                                  handleAction(idx, srv, sa.name, !!checked)
                                }
                              />
                              {sa.title}
                            </CheckboxWithLabel>
                          </div>
                        </ToolTipLabel>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right */}
                <Switch
                  checked={srv.enabled}
                  onCheckedChange={(v) =>
                    update(idx, {
                      ...srv,
                      enabled: !!v,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
      </DynamicHeight>
    </SettingsCard>
  );
}

function APIKeyDetails({
  apiKey,
}: {
  apiKey: ApiKey;
}) {
  const { createdAt, updatedAt, lastAccessedAt } = apiKey;

  return (
    <div className="border border-border bg-muted/50 rounded-lg py-6 px-4 lg:px-6 flex flex-col gap-6">
      <div>
        <h3>Client ID</h3>
        <p className="text-muted-foreground text-sm mb-2">
          Identifies your application.
        </p>

        <CopyTextButton
          textToCopy={apiKey.key}
          className="truncate w-full justify-between font-mono px-3 !h-auto py-3 bg-card max-w-[350px]"
          textToShow={apiKey.key}
          copyIconPosition="right"
          tooltip="Copy Client ID"
        />
      </div>

      {/* NOTE: for very old api keys the secret might be `null`, if that's the case we skip it */}
      {apiKey.secretMasked && (
        <div>
          <h3>Secret Key</h3>
          <p className="text-muted-foreground text-sm mb-2">
            Identifies and authenticates your application from a backend. <br />{" "}
            This is not the full secret key, Refer to your saved secret key at
            the time of creation for the full secret key.
          </p>

          <div className="px-4 py-3 border border-border rounded-lg font-mono text-sm bg-card max-w-[350px]">
            {apiKey.secretMasked}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TimeInfo label="Created" date={createdAt} />
        <TimeInfo label="Last Updated" date={updatedAt} />
        <TimeInfo label="Last Accessed" date={lastAccessedAt} />
      </div>
    </div>
  );
}

function TimeInfo(props: {
  label: string;
  date: string | undefined;
}) {
  return (
    <div>
      <p> {props.label}</p>
      <p className="text-muted-foreground text-sm">
        {props.date ? format(new Date(props.date), "MMMM dd, yyyy") : "Never"}
      </p>
    </div>
  );
}

function DeleteProject(props: {
  id: string;
  name: string;
  deleteMutation: UseMutationResult<unknown, unknown, string, unknown>;
  wording: "project" | "api-key";
  onDeleteSuccessful: () => void;
}) {
  const { id, name, deleteMutation, wording, onDeleteSuccessful } = props;
  const trackEvent = useTrack();

  const handleRevoke = () => {
    trackEvent({
      category: "api-keys",
      action: "revoke",
      label: "attempt",
    });

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success(
          `${wording === "api-key" ? "API Key" : "Project"} deleted successfully`,
        );
        onDeleteSuccessful();
        trackEvent({
          category: "api-keys",
          action: "revoke",
          label: "success",
        });
      },
      onError: (err) => {
        // onError(err);
        toast.error(
          `Failed to delete ${wording === "project" ? "Project" : "API Key"}`,
        );
        trackEvent({
          category: "api-keys",
          action: "revoke",
          label: "error",
          error: err,
        });
      },
    });
  };

  const description =
    "The associated Client ID and Secret Key will not able to access thirdweb services after deletion. This action is irreversible";

  return (
    <DangerSettingCard
      buttonOnClick={() => handleRevoke()}
      buttonLabel={wording === "project" ? "Delete project" : "Delete key"}
      confirmationDialog={{
        title: `Delete ${
          wording === "api-key" ? "API Key" : "Project"
        } "${name}"?`,
        description: description,
      }}
      description={description}
      isLoading={deleteMutation.isPending}
      title={wording === "project" ? "Delete Project" : "Delete API Key"}
    />
  );
}