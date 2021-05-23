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
import React from 'react';
import type { TagWithID } from '../database/tags/types';
import { updateTag } from '../database/tags/updateTag';
import { useMutation } from '../hooks/useMutation';
import TagEditForm, { Values } from './TagEditForm';

interface UpdateTagModalContentProps {
  tag: TagWithID;
  onSuccess?: (tag: TagWithID) => void;
}

function UpdateTagModalContent(props: UpdateTagModalContentProps) {
  const toast = useToast();
  const { tag, onSuccess } = props;

  const { mutate } = useMutation(updateTag);

  const onSubmit = async ({ name }: Values) => {
    const result = await mutate({ id: tag.id, name });
    if (result) {
      toast({
        title: `Tag '${result.name}' successfully updated`,
        status: 'success',
        isClosable: true,
      });
      if (onSuccess) onSuccess(result);
    }
  };

  return (
    <ModalContent>
      <ModalHeader>Update Tag</ModalHeader>
      <ModalCloseButton />

      <TagEditForm
        initialValues={tag}
        renderActions={(formik) => (
          <ModalFooter>
            <Button type="submit" isLoading={formik.isSubmitting}>
              Update
            </Button>
          </ModalFooter>
        )}
        onSubmit={onSubmit}
      />
    </ModalContent>
  );
}

type UpdateTagModalProps = Omit<ModalProps, 'children'> &
  UpdateTagModalContentProps;

function UpdateTagModal(props: UpdateTagModalProps) {
  const { tag, onSuccess, ...otherProps } = props;

  return (
    <Modal {...otherProps}>
      <ModalOverlay />
      <UpdateTagModalContent tag={tag} onSuccess={onSuccess} />
    </Modal>
  );
}

export default UpdateTagModal;
