import React from 'react';
import { ColumnDef } from 'tanstack-table';
import { Logger } from 'scaffold/src/Logger.ts';
import TableView from './TableView.tsx';
import { UiContext } from './context.ts';
import { error } from 'scaffold/src/util/functional.ts';
import { WorkerRecordSet } from 'scaffold/src/record_sets/WorkerRecordSet.ts';
import { WorkerDriver } from 'scaffold/src/WorkerDriverService.ts';
import { LogEntry } from 'scaffold/src/WorkerDriverService.ts';

export default ({}: {}) => {
  const { ctx, setSelectedHash, setHoveredHash } =
    React.useContext(UiContext) ?? error('No context!');

  const columns = React.useMemo<ColumnDef<WorkerDriver>[]>(() => [
    {
      header: 'logs',
      accessorFn: (driver) =>
        driver.log ?? [{ message: `Worker logging is not enabled!` }],
      cell: (props) => (
        <ol>
          {props.getValue<LogEntry[]>().map(({ message }) => (
            <li>
              <pre>{message}</pre>
            </li>
          ))}
        </ol>
      ),
    },
  ], []);

  return (
    <TableView
      recordSet={ctx.get(WorkerRecordSet)}
      columns={columns}
      expandRow={(worker) => (
        <>
          <pre>{ctx.get(Logger).serialize(worker, 2, 72)}</pre>
          <pre>EXPAND</pre>
        </>
      )}
    />
  );
};
