import { Textarea } from "@/components/ui/textarea";
import { FormControl, Input } from "@chakra-ui/react";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { FormErrorMessage, FormLabel } from "tw-components";
import { Fieldset } from "./common";
import type { CustomContractDeploymentForm } from "./custom-contract";

interface ContractMetadataFieldsetProps {
  form: CustomContractDeploymentForm;
}

export const ContractMetadataFieldset: React.FC<
  ContractMetadataFieldsetProps
> = ({ form }) => {
  return (
    <Fieldset legend="Contract Metadata">
      <div className="flex flex-col gap-6 md:grid md:grid-cols-[270px_1fr]">
        <div>
          <FormControl
            display="flex"
            flexDirection="column"
            isInvalid={
              !!form.getFieldState("contractMetadata.image", form.formState)
                .error
            }
          >
            <FormLabel>Image</FormLabel>
            <FileInput
              accept={{ "image/*": [] }}
              value={useImageFileOrUrl(form.watch("contractMetadata.image"))}
              setValue={(file) =>
                form.setValue("contractMetadata.image", file, {
                  shouldTouch: true,
                })
              }
              className="rounded border-2 border-border border-dotted transition-all duration-200"
            />
            <FormErrorMessage>
              {
                form.getFieldState("contractMetadata.image", form.formState)
                  .error?.message
              }
            </FormErrorMessage>
          </FormControl>
        </div>

        <div className="flex flex-col gap-6">
          <FormControl
            isRequired
            isInvalid={
              !!form.getFieldState("contractMetadata.name", form.formState)
                .error
            }
          >
            <FormLabel>Name</FormLabel>
            <Input
              autoFocus
              variant="filled"
              {...form.register("contractMetadata.name")}
            />
            <FormErrorMessage>
              {
                form.getFieldState("contractMetadata.name", form.formState)
                  .error?.message
              }
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              !!form.getFieldState("contractMetadata.symbol", form.formState)
                .error
            }
          >
            <FormLabel>Symbol</FormLabel>
            <Input
              variant="filled"
              {...form.register("contractMetadata.symbol")}
            />
            <FormErrorMessage>
              {
                form.getFieldState("contractMetadata.symbol", form.formState)
                  .error?.message
              }
            </FormErrorMessage>
          </FormControl>

          <FormControl
            className="flex grow flex-col"
            isInvalid={
              !!form.getFieldState(
                "contractMetadata.description",
                form.formState,
              ).error
            }
          >
            <FormLabel>Description</FormLabel>
            <Textarea
              {...form.register("contractMetadata.description")}
              className="grow bg-transparent"
            />
            <FormErrorMessage>
              {
                form.getFieldState(
                  "contractMetadata.description",
                  form.formState,
                ).error?.message
              }
            </FormErrorMessage>
          </FormControl>
        </div>
      </div>
    </Fieldset>
  );
};
