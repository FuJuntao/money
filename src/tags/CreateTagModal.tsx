import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
  useToast,
} from '@chakra-ui/react';
import Dexie from 'dexie';
import React from 'react';
import { createTag } from '../database/tags/createTag';
import type { Tag } from '../database/tags/types';
import { useMutation } from '../hooks/useMutation';
import TagEditForm, { Values } from './TagEditForm';

interface CreateTagModalContentProps {
  tag?: Partial<Tag>;
  onSuccess?: (tag: Tag) => void;
}

function CreateTagModalContent(props: CreateTagModalContentProps) {
  const toast = useToast();
  const { tag, onSuccess } = props;

  const { mutate } = useMutation(createTag);

  const onSubmit = async ({ name }: Values) => {
    try {
      const result = await mutate({ name });
      if (result) {
        toast({
          title: `Tag '${result.name}' successfully created`,
          status: 'success',
          isClosable: true,
        });
        if (onSuccess) onSuccess(result);
      }
    } catch (err: unknown) {
      if (err instanceof Dexie.DexieError)
        toast({ title: err.message, status: 'error', isClosable: true });
    }
  };

  return (
    <ModalContent>
      <ModalHeader>New Tag</ModalHeader>
      <ModalCloseButton />

      <TagEditForm
        initialValues={tag}
        renderActions={(formik) => (
          <ModalFooter>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Create new tag
            </Button>
          </ModalFooter>
        )}
        onSubmit={onSubmit}
      />
    </ModalContent>
  );
}

type CreateTagModalProps = Omit<ModalProps, 'children'> &
  CreateTagModalContentProps;

function CreateTagModal(props: CreateTagModalProps) {
  const { tag, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <CreateTagModalContent tag={tag} onSuccess={onSuccess} />
    </Modal>
  );
}

export default CreateTagModal;
