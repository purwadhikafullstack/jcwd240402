import { Modal } from "flowbite-react";

const ReusableModal = ({
  show,
  onClose,
  title,
  content: ContentComponent,
  actions,
  contentProps,
  ...rest
}) => {
  return (
    <Modal show={show} onClose={onClose} {...rest}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        {typeof ContentComponent === 'function' ? 
          <ContentComponent {...contentProps} /> 
          : ContentComponent}
      </Modal.Body>
      {actions && <Modal.Footer>{actions}</Modal.Footer>}
    </Modal>
  );
};

export default ReusableModal;
